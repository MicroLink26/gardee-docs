# Architecture backend

## Structure des dossiers

```
src/
├── app.ts                  # Express : CORS, helmet, morgan, routes
├── index.ts                # Point d'entrée : connexion DB + serveur
├── config/
│   ├── db.ts               # Connexion Mongoose
│   └── mailer.ts           # Transport nodemailer OVH SMTP
├── models/                 # Schémas Mongoose avec validateurs
│   ├── User.ts             # Compte utilisateur (client / prestataire / staff / admin)
│   ├── Prestataire.ts      # Profil prestataire (1-1 avec User)
│   ├── ServiceRequest.ts   # Demandes + messages embedded + labels + avis
│   ├── Category.ts         # Catégories de prestations
│   ├── Contact.ts          # Formulaires de contact
│   ├── PushSubscription.ts # Abonnements Web Push
│   ├── RefreshToken.ts     # Tokens de rafraîchissement (TTL index)
│   └── PasswordReset.ts    # Tokens de réinitialisation
├── controllers/            # Logique métier
│   ├── authController.ts
│   ├── userController.ts
│   ├── prestataireController.ts
│   ├── requestController.ts
│   ├── messageController.ts
│   ├── reviewController.ts
│   └── adminController.ts
├── routes/                 # Déclaration des routes + rate limiting
├── middlewares/
│   ├── auth.ts             # isConnected / isStaff / isAdmin / isPrestataire
│   └── errorHandler.ts     # Gestionnaire d'erreurs global + logging
├── services/
│   ├── emailService.ts     # Emails transactionnels (OVH SMTP)
│   ├── cronService.ts      # Géocodage, rappels, emails d'avis
│   └── pushService.ts      # Notifications Web Push (VAPID)
├── utils/
│   ├── validation.ts       # validateEmail / validateTextField / validatePassword
│   ├── rateLimiter.ts      # Limiteurs express-rate-limit par cas d'usage
│   └── logger.ts           # Logging structuré
└── types/
    └── index.ts            # AuthRequest, UserRole, RequestStatus, PaginatedResult
```

## Middlewares de sécurité

L'application Express utilise, dans l'ordre :

1. **`helmet()`** — headers HTTP de sécurité (CSP, HSTS, X-Frame-Options…)
2. **`cors()`** — origines autorisées : `gardee.fr`, `account.gardee.fr`, `v2.gardee.fr`, `localhost:4321/5173/8081`
3. **`morgan()`** — logs d'accès HTTP
4. **`cookieParser()`** — parsing du cookie `refreshToken`
5. **`express.json()`** — parsing JSON limité à la taille par défaut
6. **`fileUpload()`** — upload de fichiers limité à 5 Mo

## Machine d'états des demandes

```
                    ┌─────────────────────┐
                    │    email_pending     │
                    └──────────┬──────────┘
                               │ vérification email
                    ┌──────────▼──────────┐
                    │  client_confirmed   │
                    └──────────┬──────────┘
                               │ envoi au prestataire
                    ┌──────────▼──────────┐
                    │  sent_to_provider   │◄────────────┐
                    └──────┬──────┬───────┘             │
              accepte      │      │ propose              │
         ┌────────────────┘      │ un créneau           │
         │              ┌────────▼──────────┐           │
         │              │ provider_proposed │           │
         │              └────────┬──────────┘           │
         │              client   │  accepte             │
         │         ┌─────────────▼──────────┐           │
         │         │    client_accepted      │           │
         │         └─────────────┬──────────┘           │
         └────────────────────►  │                      │
                    ┌────────────▼──────────┐           │
                    │   provider_accepted   │───propose──┘
                    └──────────┬────────────┘
                               │
                    ┌──────────▼──────────┐
                    │      scheduled      │
                    └──────────┬──────────┘
                               │ terminé
                    ┌──────────▼──────────┐
                    │      completed      │
                    └─────────────────────┘

À tout moment → refused / cancelled
```

## Modèles Mongoose

Tous les modèles appliquent des validateurs `maxlength`, `min`, `max` comme défense en profondeur côté storage, en complément de la validation dans les contrôleurs.

| Modèle | Champs notables |
|---|---|
| `User` | `role` enum, `email` unique lowercase, `is_validated`, `location` GeoJSON |
| `Prestataire` | `userId` unique (ref User), `location` 2dsphere, `averageRating`, `geocodeStatus` |
| `ServiceRequest` | Messages, proposals, labels, ratingDetails — tous embedded |
| `RefreshToken` | Index TTL (`expireAfterSeconds: 0`) pour suppression automatique |

## Services

### emailService.ts
Envoie tous les emails transactionnels via OVH SMTP (nodemailer) :
- Vérification d'email à l'inscription
- Confirmation de demande (client)
- Notification au prestataire
- Lien de confirmation de prestation
- Rappels de réponse
- Invitation à laisser un avis

### cronService.ts
Déclenché par `GET /cron/daily?token=CRON_SECRET` :
- **Géocodage backfill** — encode les adresses des prestataires non géocodés (Nominatim, 1 req/s via Bottleneck)
- **Rappels prestataires** — relance les prestataires sans réponse depuis 24h
- **Emails d'avis** — envoie un email de notation après les prestations terminées

### pushService.ts
Notifications Web Push (VAPID) vers les abonnés enregistrés dans `PushSubscription`.

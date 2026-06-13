# Référence API

**Base URL** : `https://site--gardee-backend--fg6zdpvl2w9z.code.run/api`

**Format des réponses :**
- Succès : `{ ok: true, ...data }` ou `{ items, total, page, pageSize }` (liste paginée)
- Erreur : `{ error: "message en français" }`

**Niveaux d'authentification :**
- `—` Public, aucun token requis
- `🔑` Access token Bearer requis (`isConnected`)
- `🌿` Rôle prestataire requis
- `👤` Rôle staff requis
- `🔒` Rôle admin requis
- `🎫` Token URL (proposalToken, ratingToken, messageToken…)

---

## Auth `/api/auth`

| Méthode | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/login` | — | Connexion |
| POST | `/register` | — | Inscription prestataire |
| POST | `/logout` | — | Révoque le refresh token |
| POST | `/refresh` | cookie | Renouvelle l'access token |
| GET | `/me` | 🔑 | Profil connecté |
| GET | `/roles` | 🔑 | Rôles disponibles |
| GET | `/check-email` | — | Vérifie si l'email est déjà utilisé |
| POST | `/verify-email` | — | Vérifie le code reçu par email |
| POST | `/resend-verification` | — | Renvoie le code |
| POST | `/forgot-password` | — | Envoie le lien de réinitialisation |
| POST | `/reset-password` | — | Réinitialise le mot de passe |
| PUT | `/change-password` | 🔑 | Change le mot de passe |

## Utilisateurs `/api/users`

| Méthode | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/register/client` | — | Inscription client |
| GET | `/me` | 🔑 | Profil client connecté |
| PUT | `/me` | 🔑 | Met à jour le profil |

## Prestataires `/api/prestataires`

| Méthode | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/register` | — | Inscription prestataire |
| GET | `/search` | — | Recherche avec filtres |
| GET | `/ranking` | — | Classement par note |
| GET | `/all-ids` | — | Tous les IDs (prérendu SSR) |
| GET | `/:id` | — | Profil public |
| GET | `/:id/reviews` | — | Avis approuvés |
| POST | `/me` | 🔑 | Crée le profil prestataire |
| PUT | `/me` | 🌿 | Met à jour le profil |
| DELETE | `/me` | 🌿 | Supprime le profil |

### Paramètres de recherche (`GET /search`)

| Paramètre | Type | Description |
|---|---|---|
| `q` | string | Texte libre (nom, ville, prestation) |
| `ville` | string | Filtre par ville |
| `prestation` | string | ID ou nom de catégorie |
| `lat` + `lng` | number | Recherche géolocalisée (km) |
| `minRating` | number | Note minimale |
| `maxTarif` | number | Tarif horaire maximum |
| `sort` | string | `rating`, `tarif_asc`, `tarif_desc` |
| `page` | number | Page (défaut : 1) |
| `pageSize` | number | Résultats par page (défaut : 20) |

## Demandes `/api/requests`

| Méthode | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/` | — | Crée une demande |
| GET | `/mine` | 🌿 | Demandes reçues (prestataire) |
| GET | `/mine/client` | 🔑 | Demandes du client |
| GET | `/confirm` | 🎫 | Confirme l'email client (guest) |
| POST | `/resend` | 🎫 | Renvoie le lien de confirmation |
| GET | `/proposal/accept` | 🎫 | Accepte un créneau (email) |
| GET | `/proposal/refuse` | 🎫 | Refuse un créneau (email) |
| PATCH | `/:id/archive` | 🔑 | Archive |
| PATCH | `/:id/unarchive` | 🔑 | Désarchive |
| PATCH | `/:id/provider/propose` | 🌿 | Propose un créneau |
| POST | `/:id/provider/accept` | 🌿 | Accepte |
| POST | `/:id/provider/refuse` | 🌿 | Refuse |
| POST | `/:id/provider/cancel` | 🌿 | Annule |
| POST | `/:id/client/accept-proposal` | 🔑 | Accepte la date proposée |
| POST | `/:id/complete` | 🌿 | Marque comme terminé |
| GET | `/labels` | 🔑 | Labels disponibles |
| POST | `/:id/labels/add` | 🔑 | Ajoute un label |
| POST | `/:id/labels/remove` | 🔑 | Retire un label |

## Messages `/api/requests` (suite)

| Méthode | Endpoint | Auth | Description |
|---|---|:---:|---|
| GET | `/messages/threads` | 🌿 | Fils du prestataire |
| GET | `/messages/client-threads` | 🔑 | Fils du client |
| GET | `/messages/thread` | 🎫 | Fil d'un client guest |
| GET | `/messages/search` | 🎫 | Recherche (guest) |
| GET | `/:id/messages` | 🌿 | Messages d'une demande |
| GET | `/:id/messages/search` | 🌿 | Recherche dans une demande |
| POST | `/:id/message` | 🌿 | Envoie un message |
| POST | `/:id/client/message` | 🔑 | Répond (client connecté) |
| POST | `/messages/reply` | 🎫 | Répond (client guest) |
| POST | `/:id/messages/edit` | 🔑 | Modifie un message |
| POST | `/:id/messages/delete` | 🔑 | Supprime (soft delete) |
| POST | `/:id/messages/pin` | 🌿 | Épingle |
| POST | `/:id/messages/unpin` | 🌿 | Désépingle |
| POST | `/:id/messages/react` | 🌿 | Réaction emoji |
| POST | `/messages/react` | 🎫 | Réaction (guest) |
| POST | `/:id/messages/mark-read` | 🌿 | Marque comme lu |
| POST | `/messages/read-by-token` | 🎫 | Marque comme lu (guest) |
| POST | `/:id/messages/forward` | 🔑 | Transfère vers une autre demande |
| GET | `/:id/messages/forward-targets` | 🔑 | Cibles de transfert |

## Avis `/api/reviews`

| Méthode | Endpoint | Auth | Description |
|---|---|:---:|---|
| GET | `/validate` | 🎫 | Valide le token d'avis |
| POST | `/submit` | 🎫 | Soumet un avis (notes 1-5 + commentaire) |

### Corps de `/submit`

```json
{
  "token": "string",
  "ratings": {
    "time": 4,
    "quality": 5,
    "sympathy": 5,
    "value": 4,
    "punctuality": 5
  },
  "recommend": true,
  "comment": "Excellent travail, très professionnel."
}
```

## Administration `/api/admin`

| Méthode | Endpoint | Auth | Description |
|---|---|:---:|---|
| GET | `/users` | 👤 | Liste des utilisateurs |
| GET | `/pending` | 👤 | Prestataires en attente |
| GET | `/reviews/pending` | 👤 | Avis en attente de modération |
| GET | `/insights` | 👤 | Statistiques |
| PUT | `/prestataires/:id/validate` | 👤 | Valide un prestataire |
| PUT | `/prestataires/:id/reject` | 👤 | Rejette avec motif |
| PUT | `/reviews/:id/approve` | 👤 | Approuve un avis |
| PUT | `/reviews/:id/reject` | 👤 | Rejette un avis |
| PATCH | `/roles/:id` | 🔒 | Change le rôle |
| DELETE | `/users/:id` | 🔒 | Supprime un compte |
| POST | `/ping-shown/:userId` | 👤 | Marque le ping de rejet comme vu |

## Autres

| Méthode | Endpoint | Auth | Description |
|---|---|:---:|---|
| GET | `/api/categories` | — | Liste des catégories |
| POST | `/api/categories` | 👤 | Crée une catégorie |
| DELETE | `/api/categories/:id` | 👤 | Supprime une catégorie |
| POST | `/api/contact` | — | Formulaire de contact |
| GET | `/api/push/vapid-public-key` | — | Clé VAPID publique |
| POST | `/api/push/subscribe` | 🔑 | Abonne aux push |
| DELETE | `/api/push/subscribe` | 🔑 | Désabonne |
| GET | `/cron/daily` | 🎫 CRON_SECRET | Tâches planifiées |

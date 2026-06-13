# Authentification

## Tokens

Le système utilise deux tokens JWT :

| Token | Durée | Transport | Usage |
|---|---|---|---|
| **Access token** | 15 min | Header `Authorization: Bearer <token>` | Authentifie chaque requête |
| **Refresh token** | 30 jours | Cookie `httpOnly` `refreshToken` | Renouvelle l'access token |

Les durées sont configurables via `ACCESS_TTL_MINUTES` et `REFRESH_TTL_DAYS`.

## Rotation des refresh tokens

À chaque appel à `POST /api/auth/refresh` :
1. Le refresh token reçu est vérifié puis **supprimé** de la table `RefreshToken`
2. Un **nouveau** refresh token est émis et enregistré
3. Un nouveau access token est retourné

Si le refresh token est déjà utilisé ou inexistant, la réponse est `401`. Les tokens expirés sont supprimés automatiquement par l'index TTL MongoDB.

## Hiérarchie des middlewares

```
isConnected
    ├── isPrestataire  (role === 'prestataire' || 'staff' || 'admin')
    ├── isStaff        (role === 'staff' || 'admin')
    └── isAdmin        (role === 'admin')
```

`isConnected` vérifie le JWT, charge `req.user` depuis MongoDB et rejette avec `401` si le token est absent, invalide ou expiré.

## Rôles

| Rôle | Description |
|---|---|
| `client` | Propriétaire — soumet des demandes |
| `prestataire` | Jardinier — reçoit et traite les demandes |
| `staff` | Modérateur — valide les prestataires et les avis |
| `admin` | Accès complet — gère les rôles et peut supprimer des comptes |

## Flux d'inscription

### Client
```
POST /api/users/register/client
  → validation email + mot de passe + champs requis
  → User créé avec role 'client'
  → email de vérification envoyé
POST /api/auth/verify-email  (code reçu par email)
  → compte activé
```

### Prestataire
```
POST /api/prestataires/register
  → validation des champs
  → User créé avec role 'prestataire', is_validated = false
  → email de vérification envoyé
(vérification email identique)
(attente de validation par un staff via /api/admin/prestataires/:id/validate)
```

## Réinitialisation du mot de passe

```
POST /api/auth/forgot-password  { email }
  → crée un PasswordReset (token, expiresAt = +1h)
  → envoie un email avec le lien de réinitialisation
POST /api/auth/reset-password  { token, password }
  → vérifie et invalide le PasswordReset
  → met à jour le passwordHash
  → révoque tous les refresh tokens de l'utilisateur
```

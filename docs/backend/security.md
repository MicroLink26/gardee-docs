# Sécurité

## Validation des entrées

Chaque endpoint valide les données reçues **avant toute opération** sur la base de données, via `src/utils/validation.ts` :

```ts
validateEmail(email)           // format RFC, maxlength 255
validatePassword(password)     // min 8 chars
validateTextField(v, label, min, max)  // longueur, retourne { valid, error }
```

Les messages d'erreur sont en français et exposés directement au client.

## Rate limiting

Limites configurées par cas d'usage (Bypass en `NODE_ENV === 'test'`) :

| Limiteur | Fenêtre | Max | Endpoints concernés |
|---|---|---|---|
| `registerLimiter` | 1 heure | 3 | Inscription client, prestataire |
| `loginLimiter` | 15 min | 10 | Login |
| `forgotPasswordLimiter` | 1 heure | 5 | Mot de passe oublié |
| `resetPasswordLimiter` | 1 heure | 5 | Réinitialisation |
| `createRequestLimiter` | 1 heure | 5 | Création de demande |
| `sendMessageLimiter` | 1 min | 20 | Envoi de message |
| `tokenMessageLimiter` | 1 min | 10 | Messages par token (guest) |
| `reactionLimiter` | 1 min | 30 | Réactions emoji |
| `clientActionLimiter` | 15 min | 60 | Mutations générales |
| `providerActionLimiter` | 15 min | 60 | Actions prestataire |
| `requestTokenLimiter` | 15 min | 20 | Confirmation, avis |
| `getThreadLimiter` | 1 min | 30 | Lecture des fils |
| `markReadLimiter` | 1 min | 30 | Mark-read |

## Schémas Mongoose (défense en profondeur)

Tous les modèles appliquent des contraintes `maxlength`, `min`, `max` au niveau du stockage, en complément de la validation contrôleur.

Exemples :
- `User.email` : maxlength 255, lowercase, trim
- `ServiceRequest.messages[].content` : maxlength 5 000
- `ServiceRequest.ratingComment` : maxlength 1 000
- `Prestataire.tarifHoraire` : min 0, max 10 000
- `Prestataire.averageRating` : min 0, max 5

## Headers HTTP

`helmet()` active automatiquement :
- `Content-Security-Policy`
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- Et d'autres headers de sécurité standard

## Logging structuré

Les erreurs sont loguées avec contexte (userId, message de contexte) via `logMessageActionError` :

```ts
logMessageActionError('sendMessage: Failed to send', requestId, userId, error)
```

Le handler global `errorHandler.ts` capte toutes les erreurs non gérées et les logue de la même façon, sans exposer les détails au client.

## Mots de passe

- Hashés avec **bcryptjs**, 12 rounds de sel
- Jamais stockés en clair ni loggés
- Révocation de tous les refresh tokens lors d'un changement de mot de passe

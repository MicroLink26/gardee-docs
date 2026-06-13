# Tests

## Vue d'ensemble

**268 tests unitaires** couvrant tous les contrôleurs, services, routes et middlewares.

```bash
npm test                           # tous les tests (jest --runInBand)
npx jest --no-coverage --forceExit # rapide, sans coverage
npx jest src/controllers/__tests__/authController.test.ts  # un fichier
```

La suite tourne en **~10 secondes** car les modèles Mongoose sont mockés — aucune base de données n'est requise.

## Stratégie de mock

```ts
jest.mock('../../models/User')
jest.mock('../../models/ServiceRequest')
// etc.
```

Les tests unitaires vérifient la logique des contrôleurs (validation, flux, réponses) sans dépendance externe.

## Couverture par domaine

| Module | Tests |
|---|---|
| `authController` | Inscription, connexion, refresh, reset password, vérification email |
| `userController` | Inscription client, profil |
| `prestataireController` | Inscription, profil, recherche, classement |
| `requestController` | CRUD demandes, workflow complet (accept/refuse/propose/complete) |
| `messageController` | Envoi, édition, suppression, réactions, épinglage, transfert, mark-read |
| `reviewController` | Validation token, soumission des notes |
| `adminController` | Validation/rejet prestataires, modération avis, gestion rôles |
| `cronService` | Géocodage, rappels, emails d'avis |
| `emailService` | Templates et envoi |
| Routes `contact`, `categories`, `push`, `cron` | Validation, rate limiting |
| Middlewares `auth`, `errorHandler` | JWT, logging |

## CI

Les tests sont lancés automatiquement par GitHub Actions à chaque push sur `master`, avec type-check et build en amont. Un push dont les tests échouent est signalé immédiatement — Northflank déploie en parallèle donc un run rouge indique un déploiement potentiellement instable.

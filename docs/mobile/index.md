# Mobile

**Stack** : Expo SDK · React Native · Expo Router · TypeScript · Zustand · Axios  
**Repo** : [MicroLink26/gardee-mobile-v2](https://github.com/MicroLink26/gardee-mobile-v2)

## Démarrage rapide

```bash
cp .env.example .env   # renseigner EXPO_PUBLIC_API_URL
npm install
npm start              # serveur Expo → QR code → Expo Go
```

## Commandes

```bash
npm start          # serveur de développement
npm run android    # émulateur Android
npm run ios        # simulateur iOS
npx tsc --noEmit   # type-check
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL de base de l'API backend |

Les variables préfixées `EXPO_PUBLIC_` sont intégrées au bundle.

## Structure

```
app/                         # Routage Expo Router (file-based)
├── _layout.tsx              # Layout racine : hydrate le store auth
├── auth/                    # Écrans non authentifiés
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (tabs)/                  # Navigation par onglets (3 tabs)
│   ├── index.tsx            # Recherche de prestataires
│   ├── demandes.tsx         # Demandes en cours
│   └── profil.tsx           # Profil utilisateur
├── prestataires/[id].tsx    # Fiche prestataire + formulaire
├── requests/[id].tsx        # Fil de messages d'une demande
└── admin/
    └── pending.tsx          # Validation prestataires (staff)

services/
├── api.ts              # Axios + stockage token multi-plateforme
├── auth.ts             # login, logout, getMe, refresh, registerClient
├── users.ts            # getMyProfile, updateMyProfile
├── prestataires.ts     # search, ranking, getPrestataire, getReviews, getCategories
├── requests.ts         # CRUD demandes + actions workflow (accept, refuse, propose, complete)
├── messages.ts         # getMessages, sendMessage, sendClientMessage, markRead
└── notifications.ts    # registerForPushNotifications, saveExpoToken, removeExpoToken

stores/
└── auth.ts          # Zustand : user, login, logout, hydrate

types/
└── index.ts         # User, ServiceRequest, Category, REQUEST_STATUS_LABELS…
```

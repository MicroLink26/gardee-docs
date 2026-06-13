# Authentification mobile

## Store Zustand

`stores/auth.ts` gère l'état d'authentification de façon synchrone et persistée.

```ts
auth.user          // User | null
auth.isLoggedIn    // boolean
auth.isPrestataire // role === 'prestataire' || 'staff' || 'admin'
auth.isStaff       // role === 'staff' || 'admin'
auth.login(email, password)  // POST /auth/login → stocke le token
auth.logout()                // POST /auth/logout → vide le token
auth.hydrate()               // appelé au démarrage → recharge depuis le token stocké
```

## Flux au démarrage

```
app/_layout.tsx (useEffect)
  └─► auth.hydrate()
        ├─ getStoredToken() → aucun token → user = null
        └─ token trouvé → GET /api/auth/me
              ├─ succès → set user
              └─ 401 → clearToken(), user = null
```

Les écrans protégés vérifient `auth.isLoggedIn` et redirigent vers `/auth/login` si nécessaire.

## Stockage du token

`services/api.ts` implémente un stockage en 3 couches pour la compatibilité web/natif/serveur :

```
getStoredToken()
  1. localStorage   (navigateur web / Expo Web)
  2. expo-secure-store  (iOS Keychain / Android Keystore — chiffré)
  3. mémoire            (fallback : serveur ou env. restreint)
```

## Intercepteur de refresh

À chaque réponse 401 :

```
401 reçu (sauf sur /auth/refresh lui-même)
  └─► POST /api/auth/refresh (cookie httpOnly)
        ├─ succès → storeToken(accessToken) → requête originale relancée
        └─ échec → clearToken()
```

## Notifications push (Expo)

`services/notifications.ts` gère l'enregistrement aux notifications push mobiles.

```
auth.isLoggedIn devient true
  └─► registerForPushNotifications()
        ├─ Demande les permissions (iOS) / configure le canal (Android)
        └─ getExpoPushTokenAsync() → ExponentPushToken[...]
              └─► POST /api/push/expo-token → token stocké en base

Notification reçue
  └─► tap → addNotificationResponseReceivedListener
              ├─ data.screen === 'requests' → router.push('/requests/:id')
              └─ data.screen === 'demandes' → router.push('/(tabs)/demandes')
```

Le backend nettoie automatiquement les tokens invalides (`DeviceNotRegistered`) après chaque envoi.

## Rôles et accès

| Écran | Condition |
|---|---|
| `(tabs)/demandes` | `isLoggedIn` (sinon, prompt de connexion) |
| `(tabs)/profil` | `isLoggedIn` (sinon, prompt de connexion) |
| `admin/pending` | `isStaff` (vérifié dans l'écran) |
| `requests/[id]` | `isLoggedIn` implicite (l'API renvoie 401 sinon) |

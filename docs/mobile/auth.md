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
auth.updateUser(patch)       // fusionne un patch dans user sans appel réseau
```

`updateUser` est utilisé après `PUT /users/me` pour synchroniser l'interface immédiatement sans forcer un logout/login.

## Store catégories

`stores/categories.ts` — cache des catégories de prestations, chargé une seule fois au démarrage.

```ts
categories.load()           // GET /api/categories (lazy, idempotent)
categories.nameById(id)     // ObjectId → nom lisible, fallback = id brut
```

Chargé dans `app/_layout.tsx` en parallèle de `auth.hydrate()`. Utilisé dans `PrestataireCard`, les cartes de demandes et la fiche prestataire pour convertir les IDs en noms (les prestations sont stockées comme ObjectIds en base).

## Store messages non lus

`stores/unread.ts` — compteur de messages non lus, affiché en badge sur l'onglet Demandes.

```ts
unread.count          // nombre de messages non lus
unread.fetch()        // GET /api/requests/messages/unread-count
unread.reset()        // remet à 0 (non utilisé automatiquement)
```

Monté dans `(tabs)/_layout.tsx` avec un `setInterval(fetch, 60_000)`. Déclenché au login (`isLoggedIn` devient `true`) et nettoyé à la déconnexion.

L'endpoint backend compte les messages non lus **de l'autre partie** : pour un prestataire, les messages des clients non encore marqués comme lus ; pour un client, les messages des prestataires.

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

`services/notifications.ts` gère l'enregistrement aux notifications push mobiles. Le token Expo est enregistré automatiquement après chaque connexion réussie.

```
auth.isLoggedIn = true
  └─► registerForPushNotifications()
        ├─ requestForegroundPermissionsAsync()
        ├─ setNotificationChannelAsync('default')  [Android]
        └─ getExpoPushTokenAsync()
              └─► POST /api/push/expo-token

Tap sur une notification
  └─► addNotificationResponseReceivedListener
        ├─ data.screen === 'requests' → /requests/:id  (conversation)
        └─ data.screen === 'demandes' → /(tabs)/demandes
```

→ Voir [Notifications push](/mobile/notifications) pour la couverture complète des 8 événements, l'architecture backend et la configuration `app.json`.

## Rôles et accès

| Écran | Condition |
|---|---|
| `(tabs)/demandes` | `isLoggedIn` (sinon, prompt de connexion) |
| `(tabs)/profil` | `isLoggedIn` (sinon, prompt de connexion) |
| `admin/pending` | `isStaff` (vérifié dans l'écran) |
| `requests/[id]` | `isLoggedIn` implicite (l'API renvoie 401 sinon) |

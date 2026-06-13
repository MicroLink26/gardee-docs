# Authentification frontend

## Store Pinia

`src/stores/auth.ts` persiste uniquement l'`accessToken` via `pinia-plugin-persistedstate` (localStorage). Le refresh token est un cookie `httpOnly` géré par le navigateur.

```ts
auth.fetchMe()     // charge l'utilisateur depuis GET /api/auth/me
auth.logout()      // POST /api/auth/logout + vide le store
auth.isLoggedIn    // computed
auth.isStaff       // computed (role staff || admin)
auth.isAdmin       // computed
```

## AppShell

`AppShell.vue` est le layout de toutes les pages `/app/*`. Il s'exécute au `onMounted` côté client :

```
onMounted
  └─► auth.fetchMe()
        ├─ non connecté → redirect /app/login
        └─ connecté
              ├─ requireRole='staff' et pas staff → redirect /app/dashboard
              ├─ requireRole='admin' et pas admin → redirect /app/dashboard
              └─ affiche le contenu
```

## Intercepteur Axios

`src/services/api.ts` intercepte toutes les réponses 401 :

```
Réponse 401
  └─► POST /api/auth/refresh (avec cookie)
        ├─ succès → nouveau accessToken stocké → requête originale relancée
        └─ échec → redirect /app/login
```

## Accès par token (sans compte)

Plusieurs flux permettent à un utilisateur non connecté d'agir via un token dans l'URL :

| Page | Token | Usage |
|---|---|---|
| `/app/requests/confirm?token=...` | `verifyToken` | Confirme l'email d'une demande guest |
| `/app/requests/proposal-accept?token=...` | `proposalToken` | Accepte un créneau par email |
| `/app/requests/proposal-refuse?token=...` | `proposalToken` | Refuse un créneau par email |
| `/app/requests/rate?token=...` | `ratingToken` | Soumet un avis après prestation |
| `/app/requests/message-reply?token=...` | `messageToken` | Répond à un message sans compte |

# Notifications push

Gardee envoie des notifications push Expo (iOS / Android) pour tous les événements clés du workflow.

## Couverture complète

| Événement | Émetteur | Destinataire | Icône | Navigation au tap |
|---|---|---|:---:|---|
| Nouvelle demande reçue | `confirmRequest` | Prestataire | 🌿 | `/(tabs)/demandes` |
| Demande acceptée | `providerAccept` | Client | ✅ | `/(tabs)/demandes` |
| Demande refusée | `providerRefuse` | Client | ❌ | `/(tabs)/demandes` |
| Nouvelle date proposée | `providerPropose` | Client | 📅 | `/(tabs)/demandes` |
| Date acceptée par le client | `clientAcceptProposal` | Prestataire | ✅ | `/(tabs)/demandes` |
| Prestation annulée | `providerCancel` | Client | ❌ | `/(tabs)/demandes` |
| Nouveau message (prestataire → client) | `sendMessage` | Client | 💬 | `/requests/:id` |
| Nouveau message (client → prestataire) | `replyByToken` / `clientSendMessage` | Prestataire | 💬 | `/requests/:id` |

::: info
Les notifications messages naviguent directement vers la conversation (`/requests/:id`). Les autres événements naviguent vers la liste des demandes (`/(tabs)/demandes`) où le badge de statut est mis à jour.
:::

## Architecture

```
Backend (expoService.ts)
  sendExpoNotification(userId, { title, body, data })
    └─► POST https://exp.host/--/api/v2/push/send
          └─► token(s) Expo de l'utilisateur (ExpoToken collection)
                └─► iOS APNs / Android FCM → notification sur l'appareil

Mobile (app/_layout.tsx)
  addNotificationResponseReceivedListener
    ├─ data.screen === 'requests' → router.push('/requests/:id')
    └─ data.screen === 'demandes' → router.push('/(tabs)/demandes')
```

## Enregistrement du token

Le token Expo est enregistré automatiquement après chaque connexion :

```
auth.isLoggedIn = true
  └─► registerForPushNotifications()  (services/notifications.ts)
        ├─ requestForegroundPermissionsAsync()  ← dialog iOS
        ├─ setNotificationChannelAsync('default')  ← Android uniquement
        └─ getExpoPushTokenAsync()
              └─► POST /api/push/expo-token  → stocké dans ExpoToken (MongoDB)
```

Le token est lié à `userId` + `token` (index unique). Si l'utilisateur se connecte sur un nouvel appareil, un second token est créé — les deux reçoivent les notifications.

## Nettoyage automatique

Après chaque envoi, le backend analyse les réponses de l'API Expo :
- `DeviceNotRegistered` → token supprimé de la base
- `InvalidCredentials` → token supprimé de la base

Aucune intervention manuelle n'est nécessaire pour nettoyer les tokens d'appareils désinstallés.

## Configuration `app.json`

Les plugins et permissions requis sont déclarés dans `app.json` :

```json
{
  "plugins": [
    ["expo-notifications", {
      "icon": "./assets/icon.png",
      "color": "#16a34a"
    }],
    ["expo-location", {
      "locationWhenInUsePermission": "..."
    }]
  ],
  "ios": {
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "..."
    }
  },
  "android": {
    "permissions": [
      "android.permission.POST_NOTIFICATIONS",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.VIBRATE",
      "android.permission.ACCESS_FINE_LOCATION"
    ]
  }
}
```

::: warning iOS
`NSLocationWhenInUseUsageDescription` est **obligatoire** dans `infoPlist`. Son absence provoque un crash au runtime lors de la demande de permission de localisation.
:::

## Backend : modèle ExpoToken

```ts
// src/models/ExpoToken.ts
{
  user: ObjectId,          // référence User
  token: string,           // ExponentPushToken[...]
  createdAt: Date,
}
// Index unique (user, token)
```

Endpoints :
- `POST /api/push/expo-token` — enregistre un token (auth requise)
- `DELETE /api/push/expo-token` — supprime un token (auth requise)

# Messagerie mobile

## Architecture

La messagerie mobile repose sur `services/messages.ts` et l'écran `app/requests/[id].tsx`.

```
Demandes (tab)
  └─► card tappable → router.push('/requests/:id')
        └─► RequestThreadScreen
              ├─ getMessages(id)          GET /requests/:id/messages
              ├─ markRead(id)             POST /requests/:id/messages/mark-read
              └─ sendMessage(id, content) POST /requests/:id/message
                                          POST /requests/:id/client/message
```

## API utilisée

| Fonction | Endpoint | Auth |
|---|---|---|
| `getMessages(requestId)` | `GET /requests/:id/messages` | Prestataire |
| `sendMessage(requestId, content)` | `POST /requests/:id/message` | Prestataire |
| `sendClientMessage(requestId, content)` | `POST /requests/:id/client/message` | Client connecté |
| `markRead(requestId)` | `POST /requests/:id/messages/mark-read` | Prestataire |

La fonction appelée pour l'envoi est choisie selon `isPrestataire` :

```ts
const msg = isPrestataire
  ? await sendMessage(id, content)
  : await sendClientMessage(id, content);
```

## Rafraîchissement

L'écran de conversation se met à jour automatiquement dans trois situations :

| Déclencheur | Comportement |
|---|---|
| **Tap sur une notification push** | `useFocusEffect` recharge les messages dès que l'écran revient au premier plan |
| **Retour manuel** (depuis une autre page) | Même `useFocusEffect` — pas d'interaction requise |
| **Pull-to-refresh** (glisser vers le bas) | `RefreshControl` sur la FlatList — rechargement forcé |

Le scroll automatique vers le bas ne se déclenche que si de nouveaux messages sont arrivés (comparaison avec `lastCountRef`), évitant tout saut visuel lors des refreshs silencieux.

L'onglet **Demandes** bénéficie du même mécanisme : `useFocusEffect` recharge la liste au retour d'une conversation, mettant à jour les statuts sans interaction.

## Fonctionnalités affichées

| Fonctionnalité | Rendu |
|---|---|
| Messages envoyés | Bulle verte à droite |
| Messages reçus | Bulle blanche à gauche avec nom de l'expéditeur |
| Messages supprimés | Texte grisé italique "*Message supprimé*" |
| Réactions emoji | Badges groupés par emoji avec compteur sous la bulle |
| Messages épinglés | Affichage normal (sans indicateur visuel distinct sur mobile) |

## Notifications push

À l'arrivée d'un nouveau message, le destinataire reçoit une **notification push Expo** (💬) si l'app est installée et que les permissions ont été accordées. Le tap navigue directement vers `requests/[id]`.

→ Voir [Notifications push](/mobile/notifications) pour la couverture complète et l'architecture.

## Limitations actuelles vs web

| Fonctionnalité | Web | Mobile |
|---|:---:|:---:|
| Lire les messages | ✅ | ✅ |
| Envoyer un message | ✅ | ✅ |
| Notification push à la réception | ✅ Web Push | ✅ Expo Push |
| Rafraîchissement automatique | ✅ Polling 30s | ✅ useFocusEffect + pull-to-refresh |
| Réagir à un message | ✅ | ❌ |
| Modifier un message | ✅ | ❌ |
| Supprimer un message | ✅ | ❌ |
| Épingler un message | ✅ | ❌ |
| Transférer un message | ✅ | ❌ |
| Recherche dans les messages | ✅ | ❌ |
| Client guest (sans compte) | ✅ | ❌ |

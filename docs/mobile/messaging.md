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

## Fonctionnalités affichées

| Fonctionnalité | Rendu |
|---|---|
| Messages envoyés | Bulle verte à droite |
| Messages reçus | Bulle blanche à gauche avec nom de l'expéditeur |
| Messages supprimés | Texte grisé italique "*Message supprimé*" |
| Réactions emoji | Badges groupés par emoji avec compteur sous la bulle |
| Messages épinglés | Affichage normal (sans indicateur visuel distincts sur mobile) |

## Limitations actuelles vs web

Le web dispose de fonctionnalités supplémentaires non encore portées sur mobile :

| Fonctionnalité | Web | Mobile |
|---|:---:|:---:|
| Lire les messages | ✅ | ✅ |
| Envoyer un message | ✅ | ✅ |
| Réagir à un message | ✅ | ❌ |
| Modifier un message | ✅ | ❌ |
| Supprimer un message | ✅ | ❌ |
| Épingler un message | ✅ | ❌ |
| Transférer un message | ✅ | ❌ |
| Recherche dans les messages | ✅ | ❌ |
| Client guest (sans compte) | ✅ | ❌ |

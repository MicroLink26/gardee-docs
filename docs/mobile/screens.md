# Écrans

## Onglet Recherche (`(tabs)/index.tsx`)

Recherche de prestataires avec pagination infinie.

**Barre de recherche :**
- 🔍 Texte libre — soumet la recherche
- 📍 **Près de moi** — demande la permission de localisation, récupère les coordonnées GPS et passe `lat`/`lng` à l'API. Désactive le filtre ville (les deux sont exclusifs). Chip "Près de moi" affiché dans les filtres actifs.
- ⚙️ **Filtres** — ouvre le modal bottom sheet

**Filtres disponibles** (modal bottom sheet) :
- **Ville** — champ texte libre (ignoré si géolocalisation active)
- **Prestation** — sélection parmi les catégories chargées depuis l'API

Les filtres actifs sont affichés en chips au-dessus des résultats avec un bouton "Effacer".

**Résultats** : `PrestataireCard` avec photo (ou initiales), ville, note, tarif et noms des prestations. Tap → fiche prestataire.

::: tip Résolution des catégories
Les prestations sont stockées comme des IDs MongoDB dans l'API. Le store `categories.ts` charge les catégories au démarrage de l'app et expose `nameById(id)` pour les résoudre en noms lisibles partout dans l'interface.
:::

## Onglet Demandes (`(tabs)/demandes.tsx`)

L'onglet affiche un **badge rouge** dès qu'il y a des messages non lus (`stores/unread.ts` → `GET /requests/messages/unread-count`, polling toutes les 60s). Le badge est cappé à `99+`.

Affiche les demandes de service en cours. Le contenu s'adapte selon le rôle :

| Rôle | Données | Actions disponibles |
|---|---|---|
| Prestataire | `GET /requests/mine` | Accepter, Proposer une date, Refuser, Annuler, Marquer comme terminé |
| Client | `GET /requests/mine/client` | Accepter la date proposée |

**Proposition de date** (prestataire) : modal avec DateTimePicker natif (iOS spinner, Android dialog) et commentaire facultatif. Disponible sur les statuts `sent_to_provider` et `provider_accepted`.

**Marquer comme terminé** (prestataire) : bouton vert "✓ Terminer" sur les demandes en statut `scheduled`, côte à côte avec "Annuler". Confirmation obligatoire avant envoi.

**Tap sur une carte** → écran de conversation `requests/[id]`.

## Onglet Profil (`(tabs)/profil.tsx`)

Affiche et permet de modifier le profil de l'utilisateur connecté.

- **Vue** : email, téléphone, tarif horaire, services, description
- **Édition** : nom, prénom, téléphone + champs prestataire (tarif, adresse, ville, description)
- **Sauvegarde** : l'interface se met à jour immédiatement après l'enregistrement (store Zustand synchronisé avec la réponse API — pas de logout/login requis)
- **Non connecté** : boutons Connexion et Inscription

## Fiche prestataire (`prestataires/[id].tsx`)

Profil public chargé depuis `GET /api/prestataires/:id` :
- Photo (Cloudinary) ou initiales colorées
- Note et nombre d'avis
- Tarif horaire
- Services proposés
- Description
- Derniers avis (note qualité + commentaire)

Bouton **Contacter** (sticky en bas) → modal de demande avec formulaire (email requis, prénom, nom, objet, date souhaitée, description). Les champs email/nom/prénom sont préremplis si l'utilisateur est connecté.

## Messagerie (`requests/[id].tsx`)

Fil de conversation pour une demande spécifique.

- **Bulles** : envoyeur à droite (vert), récepteur à gauche (blanc)
- **Réactions** : groupées par emoji avec compteur
- **Messages supprimés** : placeholder "*Message supprimé*"
- **Saisie** : TextInput multi-ligne sticky en bas, KeyboardAvoidingView iOS/Android
- **Mark-read** : automatique à l'ouverture (prestataires uniquement)

## Admin (`admin/pending.tsx`)

Liste des prestataires en attente de validation — accessible uniquement aux rôles `staff` et `admin`. Permet de valider ou rejeter un prestataire avec motif.

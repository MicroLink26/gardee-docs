# Écrans

## Onglet Recherche (`(tabs)/index.tsx`)

Recherche de prestataires avec pagination infinie.

**Filtres disponibles** (modal bottom sheet) :
- **Ville** — champ texte libre
- **Prestation** — sélection parmi les catégories chargées depuis l'API

Les filtres actifs sont affichés en chips au-dessus de la liste avec un bouton "Effacer". Le bouton filtre affiche le nombre de filtres actifs.

**Résultats** : `PrestataireCard` avec photo (ou initiales), ville, note, tarif et prestations. Tap → fiche prestataire.

## Onglet Demandes (`(tabs)/demandes.tsx`)

Affiche les demandes de service en cours. Le contenu s'adapte selon le rôle :

| Rôle | Données | Actions disponibles |
|---|---|---|
| Prestataire | `GET /requests/mine` | Accepter, Proposer une date, Refuser, Annuler |
| Client | `GET /requests/mine/client` | Accepter la date proposée |

**Proposition de date** (prestataire) : modal avec DateTimePicker natif (iOS spinner, Android dialog) et commentaire facultatif. Disponible sur les statuts `sent_to_provider` et `provider_accepted`.

**Tap sur une carte** → écran de conversation `requests/[id]`.

## Onglet Profil (`(tabs)/profil.tsx`)

Affiche et permet de modifier le profil de l'utilisateur connecté.

- **Vue** : email, téléphone, tarif horaire, services, description
- **Édition** : nom, prénom, téléphone + champs prestataire (tarif, adresse, ville, description)
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

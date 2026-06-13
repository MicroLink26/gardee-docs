# Frontend

**Stack** : Astro 5 · Vue 3 · TypeScript · Pinia · Axios · Leaflet · Playwright  
**Production** : [gardee.fr](https://gardee.fr)  
**Staging** : [v2.gardee.fr](https://v2.gardee.fr)  
**Repo** : [MicroLink26/gardee-front-v2](https://github.com/MicroLink26/gardee-front-v2)

## Démarrage rapide

```bash
cp .env.example .env   # renseigner PUBLIC_API_URL
npm install
npm run dev            # Astro dev server → http://localhost:4321
```

## Commandes

```bash
npm run dev       # développement
npm run build     # build de production (prérendu + assets)
npm run preview   # prévisualise le build local
npm run smoke     # smoke test headless post-deploy
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `PUBLIC_API_URL` | URL de base de l'API backend |

## Pages publiques

| URL | Rendu | Description |
|---|---|---|
| `/` | SSR prérendu | Accueil |
| `/recherche` | SSR prérendu | Recherche de prestataires |
| `/classement` | SSR prérendu | Classement par note |
| `/carte` | Shell SSR + Vue | Carte Leaflet interactive |
| `/postuler` | SSR prérendu | Candidature prestataire |
| `/contact` | SSR prérendu | Formulaire de contact |
| `/prestataires` | SSR prérendu | Liste des prestataires |
| `/prestataires/:id` | SSR prérendu | Fiche publique (données API au build) |

## Pages dashboard `/app/*`

| URL | Accès | Description |
|---|---|---|
| `/app/login` | Public | Connexion |
| `/app/register` | Public | Inscription |
| `/app/forgot-password` | Public | Réinitialisation |
| `/app/dashboard` | Connecté | Tableau de bord |
| `/app/profil` | Connecté | Mon profil |
| `/app/mes-demandes` | Connecté | Liste des demandes |
| `/app/messagerie` | Connecté | Messagerie |
| `/app/parametres` | Connecté | Paramètres |
| `/app/requests/confirm` | Token | Confirmation de demande |
| `/app/requests/rate` | Token | Formulaire d'avis |
| `/app/admin/*` | Staff/Admin | Back-office |

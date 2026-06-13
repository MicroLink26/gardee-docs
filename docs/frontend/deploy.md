# Déploiement frontend

## Pipeline GitHub Actions

Le fichier `.github/workflows/deploy.yml` automatise entièrement la chaîne :

```
push sur main
  ├─► npm ci
  ├─► npm run build  (Astro prérendu + assets)
  ├─► node scripts/ftp-deploy.mjs  (upload FTP OVH)
  └─► npm run smoke  (smoke test headless)
```

**Staging** : déclenché manuellement via l'onglet Actions → "Run workflow" → choisir `staging`. Déploie vers `/www/v2` sans smoke test.

## Smoke test

`scripts/smoke-test.mjs` vérifie en navigateur headless (Playwright) que le site est sain après chaque déploiement :

| Vérification | Détail |
|---|---|
| HTTP 200 sur 8 pages | `/`, `/recherche`, `/classement`, `/carte`, `/postuler`, `/contact`, `/prestataires`, `/app/login` |
| Zéro erreur JS | `pageerror` + `console.error` |
| Carte : ≥ 1 marqueur | Détecte une régression Leaflet |
| Classement : ≥ 3 images | Détecte une régression avatar |
| Login : champ password présent | |
| Fiche prestataire dynamique | Photo Cloudinary si disponible |

```bash
npm run smoke                                    # prod (https://gardee.fr)
BASE_URL=https://v2.gardee.fr npm run smoke     # staging
```

## Script FTP

`scripts/ftp-deploy.mjs` :
1. Régénère le `sitemap.xml` depuis les pages présentes dans `dist/`
2. Upload `dist/` vers OVH via FTP (basic-ftp)

Credentials configurés via les secrets GitHub `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD` — ou via des variables d'environnement locales pour un deploy manuel.

## Deploy manuel

```bash
npm run build
FTP_HOST=... FTP_USER=... FTP_PASSWORD=... node scripts/ftp-deploy.mjs
npm run smoke
```

## Secrets GitHub requis

| Secret | Description |
|---|---|
| `FTP_HOST` | Hôte FTP OVH |
| `FTP_USER` | Identifiant FTP |
| `FTP_PASSWORD` | Mot de passe FTP |

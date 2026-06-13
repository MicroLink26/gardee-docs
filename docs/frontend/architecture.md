# Architecture frontend

## Stratégie de rendu

| Zone | Rendu | Raison |
|---|---|---|
| Pages publiques | **Astro SSR prérendu** au build | SEO, Core Web Vitals, données API fraîches au build |
| Dashboard `/app/*` | **Shell Astro + Vue islands** `client:load` | Interactivité, données personnalisées, auth côté client |

Les pages prérendues récupèrent les données de l'API au moment du build. Les fiches `/prestataires/:id` sont générées pour tous les prestataires via `getAllPrestataireIds` — un nouveau prestataire validé n'apparaîtra qu'au prochain déploiement.

## Structure

```
src/
├── pages/
│   ├── *.astro               # Pages publiques SSR
│   ├── prestataires/[id].astro  # Fiche dynamique prérendue
│   └── app/                  # Shell Astro + Vue islands
├── components/
│   ├── astro/                # Composants statiques (Navbar, Footer)
│   └── vue/                  # Islands Vue 3 (client:load)
│       ├── dashboard/
│       │   ├── AppShell.vue      # Layout + garde d'auth
│       │   ├── Messagerie.vue    # Fil de messages complet
│       │   └── ...
│       ├── BookingWidget.vue     # Formulaire de demande
│       ├── CarteView.vue         # Carte Leaflet + clusters
│       ├── Classement.vue        # Classement + filtres
│       ├── RatingForm.vue        # Avis par token
│       └── AvatarImage.vue       # Photo ou initiales SVG
├── stores/
│   ├── auth.ts               # Utilisateur connecté (persisté)
│   ├── categories.ts         # Catégories (chargées une fois)
│   └── toast.ts              # Notifications éphémères
├── services/
│   ├── api.ts                # Axios + intercepteur refresh
│   └── ...
├── composables/
│   ├── useAvatar.ts          # Avatar par hash d'ID
│   └── usePushNotifications.ts
└── scripts/
    ├── generate-sitemap.mjs  # Génère public/sitemap.xml
    ├── ftp-deploy.mjs        # Deploy FTP (CI)
    └── smoke-test.mjs        # Smoke test headless
```

## Client API

`src/services/api.ts` crée une instance Axios avec un intercepteur 401 qui :
1. Appelle `POST /api/auth/refresh` (cookie `httpOnly`)
2. Stocke le nouvel access token
3. Relance la requête originale

Si le refresh échoue, l'utilisateur est redirigé vers `/app/login`.

## Sitemap

Le sitemap est régénéré à chaque build depuis les pages réellement présentes dans `dist/` (incluant toutes les fiches prestataires prérendues). Il est uploadé sur le serveur FTP en même temps que le reste du build.

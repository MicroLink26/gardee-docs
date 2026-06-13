# Backend

**Stack** : Node.js 20 · Express · TypeScript · MongoDB (Mongoose) · Jest  
**Production** : `https://site--gardee-backend--fg6zdpvl2w9z.code.run/api`  
**Repo** : [MicroLink26/gardee-back-v2](https://github.com/MicroLink26/gardee-back-v2)

## Démarrage rapide

```bash
cp .env.example .env   # remplir les variables
npm install
npm run dev            # hot-reload via tsx watch
```

## Commandes

```bash
npm run dev       # serveur de développement
npm run build     # compile TypeScript → dist/
npm start         # lance dist/index.js
npx tsc --noEmit  # type-check seul
npm test          # jest --runInBand (268 tests)
```

## Variables d'environnement

| Variable | Description | Requis |
|---|---|:---:|
| `MONGO_URL` | Chaîne de connexion MongoDB Atlas | ✅ |
| `JWT_ACCESS_SECRET` | Clé de signature access tokens (≥ 32 chars) | ✅ |
| `JWT_REFRESH_SECRET` | Clé de signature refresh tokens (différente) | ✅ |
| `ACCESS_TTL_MINUTES` | Durée des access tokens (défaut : 15) | |
| `REFRESH_TTL_DAYS` | Durée des refresh tokens (défaut : 30) | |
| `MAIL_USER` | Adresse SMTP OVH | ✅ |
| `MAIL_PASS` | Mot de passe SMTP | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Identifiant Cloudinary | ✅ |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary | ✅ |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary | ✅ |
| `APP_URL` | URL du dashboard | ✅ |
| `FRONT_URL` | URL du site public | ✅ |
| `CRON_SECRET` | Token protégeant `GET /cron/daily` | ✅ |
| `NOMINATIM_USER_AGENT` | User-Agent pour le géocodage (Nominatim) | ✅ |

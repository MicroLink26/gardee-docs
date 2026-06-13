---
layout: home

hero:
  name: "Gardee"
  text: "Documentation technique"
  tagline: Marketplace connectant propriétaires et jardiniers professionnels
  actions:
    - theme: brand
      text: Backend API
      link: /backend/
    - theme: alt
      text: Frontend
      link: /frontend/
    - theme: alt
      text: Mobile
      link: /mobile/

features:
  - icon: 🌿
    title: Backend — Express + TypeScript
    details: API REST sécurisée sur Node.js 20 avec MongoDB, JWT, rate limiting, validation exhaustive et 268 tests unitaires.
    link: /backend/
    linkText: Documentation backend

  - icon: 🌐
    title: Frontend — Astro + Vue 3
    details: Pages SSR prérendues pour le SEO public, islands Vue 3 pour le dashboard interactif. Déploiement automatique via GitHub Actions avec smoke test headless.
    link: /frontend/
    linkText: Documentation frontend

  - icon: 📱
    title: Mobile — Expo React Native
    details: Application iOS et Android avec recherche filtrée, gestion des demandes, proposition de créneaux, et messagerie en temps réel.
    link: /mobile/
    linkText: Documentation mobile
---

## Vue d'ensemble

Gardee v2 est une marketplace mettant en relation des propriétaires avec des jardiniers professionnels. La plateforme repose sur trois sous-projets partageant la même API REST.

```
gardee-v2/
├── backend/    Express + TypeScript + MongoDB     → Northflank (auto-deploy)
├── frontend/   Astro SSR + Vue 3 islands          → OVH FTP (GitHub Actions)
└── mobile/     Expo (React Native)                → Distribution manuelle
```

## Flux principal

1. Un **client** soumet une demande de service (invité ou connecté)
2. L'email du client est vérifié (lien de confirmation)
3. La demande est transmise au **prestataire**
4. Le prestataire accepte, refuse ou propose un autre créneau
5. Les deux parties s'échangent des messages
6. Une fois la prestation terminée, le client reçoit un email d'invitation à laisser un **avis**

## Statuts des demandes

| Statut | Description |
|---|---|
| `email_pending` | Email client en attente de confirmation |
| `client_confirmed` | Email confirmé, demande créée |
| `sent_to_provider` | Transmise au prestataire |
| `provider_proposed` | Prestataire a proposé un créneau alternatif |
| `provider_accepted` | Prestataire a accepté |
| `client_accepted` | Client a accepté la date proposée |
| `scheduled` | Prestation planifiée |
| `completed` | Prestation terminée |
| `refused` | Refusée par le prestataire |
| `cancelled` | Annulée |

## Infrastructure

| Composant | Service | CI/CD |
|---|---|---|
| Backend | [Northflank](https://northflank.com) — auto-deploy au push | GitHub Actions : tsc + 268 tests + build |
| Frontend | OVH FTP (`/www/front`) | GitHub Actions : build → FTP → smoke test headless |
| Mobile | Distribution Expo | GitHub Actions : tsc |
| Dépendances | Dependabot hebdomadaire (lundi) | — |
| Cron daily | GitHub Actions schedule 07h00 UTC | Géocodage, rappels, emails d'avis |
| Documentation | [GitHub Pages](https://microlink26.github.io/gardee-docs/) | Auto-rebuild après chaque push sur back/front/mobile |

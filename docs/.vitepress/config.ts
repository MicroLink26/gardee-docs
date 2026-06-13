import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Gardee',
  description: 'Documentation de la plateforme Gardee — marketplace jardiniers professionnels',
  lang: 'fr-FR',
  base: '/gardee-docs/',

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/gardee-docs/favicon.png' }],
  ],

  themeConfig: {
    logo: { src: '/logo.webp', alt: 'Gardee', width: 120, height: 40 },
    siteTitle: false,

    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Backend', link: '/backend/' },
      { text: 'Frontend', link: '/frontend/' },
      { text: 'Mobile', link: '/mobile/' },
      {
        text: 'Liens',
        items: [
          { text: 'gardee.fr', link: 'https://gardee.fr' },
          { text: 'API', link: 'https://site--gardee-backend--fg6zdpvl2w9z.code.run/api/categories' },
          { text: 'GitHub', link: 'https://github.com/MicroLink26' },
        ],
      },
    ],

    sidebar: {
      '/backend/': [
        {
          text: 'Backend',
          items: [
            { text: 'Vue d\'ensemble', link: '/backend/' },
            { text: 'Architecture', link: '/backend/architecture' },
            { text: 'Authentification', link: '/backend/auth' },
            { text: 'Référence API', link: '/backend/api' },
            { text: 'Sécurité', link: '/backend/security' },
            { text: 'Tests', link: '/backend/tests' },
          ],
        },
      ],
      '/frontend/': [
        {
          text: 'Frontend',
          items: [
            { text: 'Vue d\'ensemble', link: '/frontend/' },
            { text: 'Architecture', link: '/frontend/architecture' },
            { text: 'Authentification', link: '/frontend/auth' },
            { text: 'Déploiement', link: '/frontend/deploy' },
          ],
        },
      ],
      '/mobile/': [
        {
          text: 'Mobile',
          items: [
            { text: 'Vue d\'ensemble', link: '/mobile/' },
            { text: 'Écrans', link: '/mobile/screens' },
            { text: 'Authentification', link: '/mobile/auth' },
            { text: 'Messagerie', link: '/mobile/messaging' },
            { text: 'Notifications push', link: '/mobile/notifications' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MicroLink26' },
    ],

    footer: {
      message: 'Gardee v2 — Marketplace de jardiniers professionnels',
    },

    search: {
      provider: 'local',
    },

    outline: { label: 'Sur cette page', level: [2, 3] },
    docFooter: { prev: 'Précédent', next: 'Suivant' },
    darkModeSwitchLabel: 'Apparence',
    lightModeSwitchTitle: 'Passer au mode clair',
    darkModeSwitchTitle: 'Passer au mode sombre',
    returnToTopLabel: 'Retour en haut',
  },
})

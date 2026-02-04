# Tradexa — plateforme de traduction professionnelle (Next.js Full‑Stack)

## Inclus
- UI moderne (bleu ciel / blanc), landing + pages publiques
- i18n **FR + EN + AR** (AR en RTL)
- Auth (NextAuth Credentials) + rôles: CLIENT / TRANSLATOR / ADMIN
- Commandes: création + liste + détail
- Chat (stocké en DB, polling simple)
- Paiement (Stripe Checkout Session template)
- DB Prisma (PostgreSQL)

## Démarrage
1) Installer
```bash
pnpm i   # ou npm i / yarn
```

2) Variables d’environnement  
Créez `.env` (voir `.env.example`)

3) DB (PostgreSQL)
```bash
pnpm prisma:migrate
pnpm dev
```

## Accès
- Client: /{locale}/dashboard/orders
- Traducteur: /{locale}/dashboard/translator
- Admin: /{locale}/admin (mettre role=ADMIN en DB)

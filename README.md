# TM Auto Service 🚗

Site vitrine + back-office pour **TM Auto Service** — garage automobile multimarque.

## Stack technique

- **Next.js 16** (App Router, TypeScript)
- **TailwindCSS v4** + composants shadcn/ui
- **Prisma** + PostgreSQL
- **NextAuth v5** (authentification admin)
- **Zod** (validation)
- **Lucide React** (icônes)

## Démarrage rapide

### 1. Variables d'environnement

```bash
cp .env.example .env
```

Modifier `.env` avec vos informations (BDD PostgreSQL, AUTH_SECRET…).

### 2. Installer les dépendances

```bash
npm install
```

### 3. Initialiser la base de données

```bash
npx prisma db push
npm run db:seed
```

### 4. Lancer le serveur

```bash
npm run dev
```

Accédez à :
- **Site public** : [http://localhost:3000](http://localhost:3000)
- **Admin** : [http://localhost:3000/admin](http://localhost:3000/admin)

### Identifiants admin par défaut

| Email | Mot de passe |
|---|---|
| `admin@tm-auto-service.fr` | `admin123` |

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm start` | Serveur production |
| `npm run db:push` | Synchroniser le schéma Prisma |
| `npm run db:seed` | Peupler la BDD avec des données de test |
| `npm run db:studio` | Ouvrir Prisma Studio (GUI) |

## Architecture

```
src/
├── app/
│   ├── (public)/          # Pages publiques
│   │   ├── page.tsx        # Accueil
│   │   ├── services/       # Services + détail
│   │   ├── vehicules/      # Vente véhicules + détail
│   │   ├── location/       # Location + détail
│   │   ├── reprise/        # Reprise de véhicule
│   │   ├── contact/        # Formulaire de contact
│   │   ├── a-propos/       # À propos
│   │   ├── mentions-legales/
│   │   ├── confidentialite/
│   │   └── cookies/
│   ├── admin/              # Back-office (protégé)
│   │   ├── page.tsx        # Dashboard
│   │   ├── vehicules/      # CRUD véhicules
│   │   ├── leads/          # Gestion des leads
│   │   └── settings/       # Paramètres
│   └── api/                # Route handlers
├── components/
│   ├── ui/                 # Composants shadcn/ui
│   ├── layout/             # Header, Footer, WhatsApp…
│   ├── forms/              # Formulaires
│   ├── vehicles/           # Composants véhicules
│   └── admin/              # Composants admin
├── content/                # Contenu statique FR
└── lib/                    # Utilitaires (db, auth, seo…)
```

## Fonctionnalités

### Site public
- Design premium noir / rouge / blanc, responsive mobile-first
- 13 pages avec SEO complet (OpenGraph, schema.org JSON-LD, sitemap)
- Catalogue véhicules avec filtres (marque, prix, année, carburant…)
- Catalogue location avec tarifs journalier/hebdo/mensuel
- Formulaire de reprise véhicule
- Bouton WhatsApp flottant + Live chat intégré
- Tracking (Facebook Pixel, GA4, GTM) avec consentement cookies RGPD

### Back-office admin
- Dashboard avec KPIs
- CRUD véhicules complet avec upload d'images
- Gestion des leads avec statuts et filtres
- Paramètres : tracking, WhatsApp, live chat, informations entreprise
- Authentification sécurisée (NextAuth + bcrypt)

## TODO — Production

- [ ] Configurer SMTP dans `src/lib/email.ts`
- [ ] Migrer le stockage d'images vers Supabase ou S3
- [ ] Compléter les mentions légales
- [ ] Changer le mot de passe admin par défaut
- [ ] Générer un vrai AUTH_SECRET : `openssl rand -base64 32`

## Licence

Privé — Tous droits réservés.

# 🐇 Lapinou — Rabbit Shop

Site vitrine complet pour la vente de lapins, avec réservation en ligne,
notification email (Resend) + WhatsApp, et back-office admin.

Stack : **Express.js** (API) + **Next.js 14** (site) + **Prisma (SQLite en dev / PostgreSQL Neon en prod)** + **Cloudinary** + **Resend**

> ⚠️ Les clés dans `.env.production` ne doivent jamais être commitées sur Git. Le fichier `.env.production` est ignoré grâce à `.gitignore`. En production, configurez les variables d'environnement directement sur votre hébergeur (Render/Vercel).

---

## Structure

```
rabbit-shop/
├─ api/              # Express — REST API
│  ├─ prisma/
│  │  ├─ schema.prisma             # SQLite (Développement local)
│  │  ├─ schema.production.prisma  # PostgreSQL (Production / Neon)
│  │  ├─ seed.js                   # 4 lapins de démo
│  │  └─ dev.db                    # Base SQLite locale (générée, jamais commitée)
│  ├─ scripts/
│  │  ├─ generate-prisma-client.js # Filet de sécurité : génère le bon client selon NODE_ENV
│  │  └─ fix-prod-photos.js        # Script ponctuel de correction de données (Neon)
│  └─ src/
│     ├─ config/     # env.js, prisma.js
│     ├─ routes/     # rabbits, reservations (admin), admin (login), contact
│     ├─ controllers/
│     ├─ services/   # logique métier + emails (Resend)
│     ├─ middlewares/ # adminAuth (mot de passe), error
│     └─ validations/
├─ web/              # Next.js 14 App Router
│  ├─ app/
│  │  ├─ page.tsx               # Landing page unique : Accueil + À propos + Nos lapins + Contact (sections ancrées)
│  │  ├─ rabbits/[slug]/        # Page détail d'une race (reste une page à part)
│  │  ├─ rabbits/page.jsx       # redirige vers /#lapins (catalogue fusionné dans la home)
│  │  ├─ about/page.tsx         # redirige vers /#a-propos (fusionné dans la home)
│  │  ├─ contact/page.tsx       # redirige vers /#contact (fusionné dans la home)
│  │  ├─ aide/                  # FAQ — page à part
│  │  ├─ conditions/            # Conditions d'utilisation — page à part
│  │  ├─ confidentialite/       # Politique de confidentialité — page à part
│  │  ├─ admin/                 # Back-office (protégé par mot de passe)
│  │  └─ .env.local
│  ├─ public/                   # Favicon, icônes PWA, manifest.json, sw.js, logo.png
│  └─ components/
│     ├─ AboutSection.tsx       # Section "À propos" intégrée à la landing page
│     ├─ ContactSection.tsx     # Section "Contact" intégrée à la landing page
│     └─ admin/                 # AdminGate, RabbitForm, RabbitsManager, ReservationsManager
├─ uploads/          # Dossier local dev (images locales)
├─ .env              # Configuration locale SQLite & dev (jamais commité)
└─ .env.production   # Configuration production PostgreSQL Neon (jamais commité)
```

> ℹ️ **Une seule source de vérité pour Prisma** : tous les fichiers (`schema.prisma`,
> `schema.production.prisma`, `seed.js`, `dev.db`) vivent désormais uniquement dans
> `api/prisma/`. L'ancienne duplication vers un dossier `prisma/` à la racine a été
> supprimée — c'était la cause du bug `the URL must start with the protocol 'file:'`
> en production (le client généré pouvait être désynchronisé du `DATABASE_URL` réel).

---

## Variables d'environnement

### Dev local : `/.env` (lu par l'API Express)

```bash
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3003

# Base de données locale (SQLite)
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db

# Cloudinary (upload photos)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Resend (emails de notification)
RESEND_API_KEY=re_votre_resend_api_key
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=votre-email@exemple.com

# WhatsApp — numéro vendeur (sans le +, format international)
WAVE_NUMBER_NEXURA=votre_numero_whatsapp

# Mot de passe pour accéder à /admin et protéger les routes admin de l'API
ADMIN_PASSWORD=votre_mot_de_passe_admin
```

### Production : `/.env.production` (PostgreSQL Neon) — usage local uniquement

```bash
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://votre-site.vercel.app

# Base de données distante (Neon PostgreSQL)
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://votre_utilisateur:votre_mot_de_passe@votre_hote.neon.tech/neondb?sslmode=require

# ... (Autres clés API identiques à votre configuration de production)
```

> ⚠️ Ce fichier sert uniquement si vous lancez l'API en local avec `NODE_ENV=production`
> (ex: pour tester contre Neon avant de déployer). **Il n'est jamais envoyé sur Render** —
> il est dans `.gitignore`. Sur Render, les vraies variables viennent du dashboard
> (Environment), pas d'un fichier.

### Next.js : `/web/.env.local` (lu par Next.js en dev)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3003
NEXT_PUBLIC_WHATSAPP=votre_numero_whatsapp
```

En production, ces mêmes variables sont définies dans `vercel.json` (racine et
`web/vercel.json`, dupliquées par sécurité selon le Root Directory configuré sur
Vercel) — ou directement dans Vercel Dashboard > Settings > Environment Variables.

---

## Démarrage rapide

### 1. Installer les dépendances
```bash
cd api
npm install   # génère aussi le client Prisma (SQLite) automatiquement via postinstall

cd web
npm install
```

### 2. Base de données de développement (SQLite locale)
Depuis le dossier `api/` :
```bash
npm run db:setup
```
*Cette commande génère le client Prisma, pousse le schéma SQLite
(`api/prisma/schema.prisma`), crée le fichier `api/prisma/dev.db` et charge le
jeu de données de test (`api/prisma/seed.js`).*

### 3. Lancer les serveurs de dev
```bash
# Terminal 1 — API (port 4000)
cd api 
npm run dev

# Terminal 2 — Site Web (port 3003)
cd web
npm run dev
```

---

## Commandes Prisma (DB) utiles (depuis `api/`)

### Développement (SQLite)
* **`npm run db:generate`** : Regénérer le client Prisma.
* **`npm run db:push`** : Mettre à jour la base de données locale SQLite selon vos modèles.
* **`npm run db:seed`** : Lancer le script de seeding sur SQLite.
* **`npm run db:studio`** : Ouvrir l'interface graphique Prisma Studio pour voir la base SQLite locale.
* **`npm run db:reset`** : Réinitialiser complètement la base SQLite locale.

### Production (Neon PostgreSQL)
* **`npm run db:generate:prod`** : Regénérer le client Prisma avec le schema PostgreSQL.
* **`npm run db:push:prod`** : Pousser les modifications de schéma sur votre base de données Neon PostgreSQL.
* **`npm run db:seed:prod`** : Seeder les lapins de test sur la base de données Neon.
* **`npm run db:studio:prod`** : Lancer Prisma Studio connecté à votre base Neon.



## Logique métier

Depuis la migration vers le **modèle de stock par race**, une fiche `Rabbit`
représente une race/portée disponible en plusieurs exemplaires, pas un individu
unique. Le client choisit une quantité (1 à 50) et réserve ; le stock décompte
**immédiatement** (comme un panier classique), sans étape de validation
intermédiaire bloquante.

| Statut      | Carte accueil          | Page détail                            |
|-------------|-------------------------|-----------------------------------------|
| `available` | Normale, cliquable, affiche le stock restant | Sélecteur de quantité + bouton Réserver |
| `sold`      | Grisée, "Stock épuisé"  | Bouton désactivé "Stock épuisé"         |

**Cycle de vie d'une commande :**
1. Le client choisit une quantité sur la fiche (plafonnée au stock restant) et clique "Réserver" → une transaction Prisma atomique vérifie le stock disponible, crée la réservation (avec la quantité), et décompte immédiatement le stock de la fiche. Si le stock atteint 0, la fiche passe automatiquement en `sold` → **email envoyé à l'admin via Resend**, incluant la quantité et le total.
2. WhatsApp s'ouvre automatiquement avec un message pré-rempli mentionnant la quantité et le prix total, pour finaliser les détails avec le client.
3. L'admin consulte `/admin`, voit la réservation (avec son badge de quantité ×N) et confirme une fois le contact établi.
4. Si une réservation est annulée par l'admin, la quantité réservée est **restituée** au stock de la fiche, qui repasse en `available` si le stock redevient positif.
5. Le client peut réserver à nouveau plus tard sur la même fiche tant qu'il reste du stock — chaque réservation est indépendante et ne décompte que sa propre quantité.

Le dashboard admin (`/admin`) affiche un suivi de stock global (stock restant /
unités déjà réservées-vendues) ainsi qu'un classement des races les plus
vendues en unités, via `GET /api/rabbits/admin/stock-summary`.

---

---

## PWA (Progressive Web App)

Le site `web/` est installable sur mobile et desktop :
* `web/public/manifest.json` — nom, icônes, couleurs, mode `standalone`.
* `web/public/sw.js` — service worker minimal (cache le shell statique, ne cache
  jamais `/api/*` pour éviter d'afficher des données obsolètes).
* `web/components/ServiceWorkerRegister.tsx` — enregistre le service worker côté
  client. Désactivé par défaut en dev (sinon le cache du SW gêne le hot-reload) ;
  pour le tester en dev, définir `NEXT_PUBLIC_ENABLE_SW_DEV=1`.
* Icônes générées depuis le logo Lapinou : favicon (.ico + PNG 16/32/48),
  `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png` et une version
  `icon-maskable-512.png` (fond plein, zone de sécurité 70%) pour Android.

---

## Déploiement

* **Vercel** → Dossier `web/` (Next.js)
* **Render** → Dossier `api/` (Express.js)
* **Neon** → Base de données PostgreSQL

**Render — Configuration du build API (`render.yaml`) :**
* **Root Directory** : `api`
* **Build Command** : `npm install && npx prisma generate --schema=prisma/schema.production.prisma`
  (le `npm install` déclenche aussi `postinstall`, qui régénère le client selon `NODE_ENV`
  comme filet de sécurité — voir `api/scripts/generate-prisma-client.js`)
* **Start Command** : `node src/server.js`

**Variables d'environnement Render (API)** :
`NODE_ENV=production`, `DATABASE_URL`, `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `WAVE_NUMBER_NEXURA`, `ADMIN_PASSWORD`, `FRONTEND_URL` (URL Vercel).

**Variables d'environnement Vercel (Front)** :
`NEXT_PUBLIC_API_URL` (URL Render + `/api`), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP`.

> ⚠️ Si le Root Directory du projet Vercel est `web/`, c'est `web/vercel.json` qui
> s'applique (pas celui de la racine) — les deux fichiers contiennent maintenant les
> mêmes variables par sécurité. Si le frontend et le backend semblent ne plus se
> "parler" (erreurs réseau dans la console, pas dans les logs serveur), vérifiez
> d'abord `NEXT_PUBLIC_API_URL` dans Vercel Dashboard > Settings > Environment
> Variables — la console affichera un avertissement explicite si elle est absente.

---

## Roadmap / améliorations possibles
- [ ] Édition photo dans `/admin` : ne gère que le texte, pas encore les photos
- [ ] Remplacer le mot de passe admin partagé par un vrai système de compte
      si plusieurs personnes doivent administrer le site
- [ ] Pagination du catalogue (section `#lapins` sur la home) si le nombre de races dépasse ~30 fiches

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
│  └─ src/
│     ├─ config/     # env.js, prisma.js
│     ├─ routes/     # rabbits, reservations (admin), admin (login), contact
│     ├─ controllers/
│     ├─ services/   # logique métier + emails (Resend)
│     ├─ middlewares/ # adminAuth (mot de passe), error
│     └─ validations/
├─ web/              # Next.js 14 App Router
│  ├─ app/
│  │  ├─ page.tsx               # Accueil
│  │  ├─ rabbits/               # Liste + détail [slug]
│  │  ├─ about/                 # À propos
│  │  ├─ contact/               # Formulaire + lien WhatsApp
│  │  ├─ admin/                 # Back-office (protégé par mot de passe)
│  │  └─ .env.local
│  └─ components/
│     └─ admin/                 # AdminGate, RabbitForm, RabbitsManager, ReservationsManager
├─ prisma/
│  ├─ schema.prisma             # SQLite (Développement local)
│  ├─ schema.production.prisma  # PostgreSQL (Production / Neon)
│  └─ seed.js                   # 4 lapins de démo
├─ uploads/          # Dossier local dev (images locales)
├─ .env              # Configuration locale SQLite & dev (jamais commité)
└─ .env.production   # Configuration production PostgreSQL Neon (jamais commité)
```

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

### Production : `/.env.production` (PostgreSQL Neon)

```bash
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://votre-site.vercel.app

# Base de données distante (Neon PostgreSQL)
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://votre_utilisateur:votre_mot_de_passe@votre_hote.neon.tech/neondb?sslmode=require

# ... (Autres clés API identiques à votre configuration de production)
```

### Next.js : `/web/.env.local` (lu par Next.js)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3003
NEXT_PUBLIC_WHATSAPP=votre_numero_whatsapp
```

---

## Démarrage rapide

### 1. Installer les dépendances
```bash
# Dans le dossier racine du projet
cd api
npm install

cd ../web
npm install
```

### 2. Base de données de développement (SQLite locale)
À la racine du projet, lancez :
```bash
npm run db:setup
```
*Cette commande va automatiquement générer le client Prisma, pousser le schéma SQLite (`prisma/schema.prisma`), créer le fichier `prisma/dev.db` et charger le jeu de données de test (`prisma/seed.js`).*

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

## Commandes Prisma (DB) utiles (à la racine)

### Développement (SQLite)
* **`npm run db:generate`** : Regénérer le client Prisma.
* **`npm run db:push`** : Mettre à jour la base de données locale SQLite selon vos modèles.
* **`npm run db:seed`** : Lancer le script de seeding sur SQLite.
* **`npm run db:studio`** : Ouvrir l'interface graphique Prisma Studio pour voir la base SQLite locale.
* **`npm run db:reset`** : Réinitialiser complètement la base SQLite locale.

### Production (Neon PostgreSQL)
* **`npm run db:push:prod`** : Pousser les modifications de schéma sur votre base de données Neon PostgreSQL.
* **`npm run db:seed:prod`** : Seeder les lapins de test sur la base de données Neon.
* **`npm run db:studio:prod`** : Lancer Prisma Studio connecté à votre base Neon.

---

## Accéder à l'admin
Rendez-vous sur `http://localhost:3003/admin` et entrez le mot de passe défini dans `ADMIN_PASSWORD` (par défaut : `lapinou-admin-2026`).

---

## Logique métier

| Statut      | Carte accueil          | Page détail                            |
|-------------|-------------------------|-----------------------------------------|
| `available` | Normale, cliquable      | Formulaire de réservation actif         |
| `reserved`  | Grisée, non-cliquable   | Overlay "Réservé" + formulaire grisé    |
| `sold`      | Grisée, non-cliquable   | Overlay "Vendu" + formulaire grisé      |

**Cycle de vie d'une commande :**
1. Le client soumet le formulaire de réservation → le lapin passe automatiquement en `reserved` (transaction Prisma atomique) → **email envoyé à l'admin via Resend**.
2. L'admin consulte `/admin`, voit la réservation et clique sur le **bouton WhatsApp pré-rempli** (`wa.me`) pour finaliser les détails avec le client.
3. L'admin confirme la réservation, puis la marque `sold` une fois la transaction physique effectuée.
4. Si la réservation est annulée, le lapin redevient instantanément `available` dans le catalogue.

---

## API Endpoints

```
GET  /api/rabbits                       liste publique (filtrable par ?breed=, ?status=)
GET  /api/rabbits/:slug                 détail
POST /api/rabbits/:slug/reserve         réservation (public)

POST  /api/admin/login                  vérifie ADMIN_PASSWORD, renvoie un token
POST  /api/rabbits                      créer un lapin       (admin — Authorization: Bearer <password>)
PATCH /api/rabbits/:id                  modifier un lapin    (admin)
DELETE /api/rabbits/:id                 supprimer un lapin   (admin)

GET   /api/admin/reservations           liste                (admin)
PATCH /api/admin/reservations/:id/confirm
PATCH /api/admin/reservations/:id/cancel
PATCH /api/admin/reservations/:id/sold

POST /api/contact                       message depuis la page Contact (public)
```

---

## Déploiement

* **Vercel** → Dossier `web/` (Next.js)
* **Render** → Dossier `api/` (Express.js)
* **Neon** → Base de données PostgreSQL

**Render — Configuration du build API :**
* **Build Command** : `cd api && npm install && npx prisma generate --schema=../prisma/schema.production.prisma`
* **Start Command** : `node api/src/server.js`

**Variables d'environnement Render (API)** :
`DATABASE_URL`, `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `WAVE_NUMBER_NEXURA`, `ADMIN_PASSWORD`, `FRONTEND_URL` (URL Vercel).

**Variables d'environnement Vercel (Front)** :
`NEXT_PUBLIC_API_URL` (URL Render + `/api`), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP`.
gère que le texte, pas encore les photos
- [ ] Remplacer le mot de passe admin partagé par un vrai système de compte
      si plusieurs personnes doivent administrer le site
- [ ] Pagination de la liste `/rabbits` si le catalogue dépasse ~30 lapins

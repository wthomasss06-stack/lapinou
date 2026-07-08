# 🐇 Lapinou — Rabbit Shop

> Une plateforme moderne de présentation et de réservation de lapins, pensée pour les éleveurs et les particuliers.

Lapinou est une application web complète permettant de présenter des races de lapins, gérer les stocks, recevoir des réservations en ligne et administrer facilement le catalogue depuis un tableau de bord sécurisé.

## ✨ Fonctionnalités

### Pour les visiteurs

- Présentation des différentes races
- Galerie photos et vidéos
- Consultation des fiches détaillées
- Réservation en ligne
- Sélection de la quantité
- Ouverture automatique d'une conversation WhatsApp
- Site responsive
- Progressive Web App (PWA)

### Pour l'administrateur

- Authentification sécurisée
- Gestion des races
- Gestion des réservations
- Gestion du stock
- Notifications email
- Tableau de bord
- Statistiques de ventes

---

# 🛠 Stack technique

| Frontend | Backend | Base de données | Services |
|-----------|----------|----------------|-----------|
| Next.js 14 | Express.js | Prisma ORM | Cloudinary |
| React | Node.js | SQLite | Resend |
| TypeScript | REST API | PostgreSQL (Neon) | WhatsApp |
| GSAP | | | |

---

# 📁 Architecture

```text
rabbit-shop/
├── api/
│   ├── prisma/
│   ├── scripts/
│   └── src/
├── web/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── lib/
└── uploads/
```

---

# 🚀 Installation

```bash
git clone <repository>

cd rabbit-shop

cd api
npm install

cd ../web
npm install
```

---

# ⚙️ Variables d'environnement

Le projet utilise :

- `.env`
- `.env.production`
- `web/.env.local`

⚠️ Les clés API ne doivent jamais être versionnées sur GitHub.

---

# 🗄️ Développement

Depuis le dossier `api` :

```bash
npm run db:setup
```

Puis lancer :

```bash
# API
npm run dev

# Frontend
cd ../web
npm run dev
```

---

# 📦 Commandes utiles

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
```

---

# 🛒 Fonctionnement

Chaque fiche représente une race disponible en plusieurs exemplaires.

Le client :

1. choisit une quantité ;
2. réserve en ligne ;
3. le stock est mis à jour automatiquement ;
4. l'administrateur reçoit une notification email ;
5. WhatsApp s'ouvre avec un message pré-rempli.

En cas d'annulation, le stock est automatiquement restauré.

---

# 📱 Progressive Web App

- Installation sur Android
- Installation sur iPhone
- Installation sur Windows
- Installation sur macOS

---

# ☁️ Déploiement

| Service | Plateforme |
|----------|------------|
| Frontend | Vercel |
| Backend | Render |
| Base de données | Neon PostgreSQL |

---

# 📸 Captures d'écran

Ajoutez vos captures ici :

```text
screenshots/
├── home.webp
├── catalogue.webp
├── detail.webp
└── admin.webp
```

---

# 🔒 Sécurité

- Variables d'environnement protégées
- Validation des données
- Prisma ORM
- Cloudinary
- API REST

---

# 🗺️ Roadmap

- [ ] Gestion avancée des photos
- [ ] Authentification multi-utilisateurs
- [ ] Paiement en ligne
- [ ] Tableau de bord analytique
- [ ] Recherche avancée
- [ ] Pagination du catalogue

---

#  Auteur

Développé par **AKATech**.

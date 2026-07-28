#  CHEZ FLORENCE — Rabbit Shop🐇

> Une plateforme moderne de présentation et de réservation de lapins, pensée pour les éleveurs et les particuliers.

CHEZ FLORENCE est une application web complète permettant de présenter des races de lapins, gérer les stocks, recevoir des réservations en ligne et administrer facilement le catalogue depuis un tableau de bord sécurisé.

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
cd api
npm run dev

# Frontend
cd web
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

# 🎬 Animations & Effets Marquants

Le site repose sur une expérience cinématique scroll-driven et interactive. Voici les effets clés, implémentés avec **GSAP** (ScrollTrigger, SplitText), **Framer Motion** et **OGL/WebGL**.

---

## 1. Loader Cinématique — "Gravité"

**Fichier :** `Loader.tsx`

Séquence d'introduction en 3 phases, jouée une fois par session :

- **Phase 1 — Préchargement** : Titre "Chez / Florence" avec reveal caractère par caractère (stagger random) + compteur `000 → 100` animé. Glissement vers le haut à la fin.
- **Phase 2 — Gravité** : 4 bandes-rideaux se déploient en rebond (`bounce.out`). 5 lapins (images) tombent depuis le haut de l'écran (`y: -50vh`) et atterrissent en rebond élastique (`elastic.out(1, 0.5)`) aux 4 coins + centre. Logo qui apparaît en élastique. Pause, puis sortie en scale ×3 + rotation 180° + fade.
- **Phase 3 — Révélation** : Le loader remonte via `clip-path` pour révéler le Hero.

---

## 2. Hero — Vortex 3×3 (Desktop)

**Fichier :** `HeroSection.tsx`

- **Grille 3×3** de photos de lapins qui effectue un **vortex** au scroll :
  - `pin` sur toute la section, `scrub: 0.8`
  - La grille passe de `scale: 1` à `scale: 0.4` + `rotation: 180°`
  - Les images internes tournent en sens inverse (`rotation: -180°`) + zoom inverse (`scale: 1.25 → 1`)
- **Titre élastique** : "FLORENCE" en `SplitText` (caractères) avec reveal `elastic.out(0.75, 0.3)`
- **Contenu central** qui apparaît en fade-in une fois le vortex terminé
- **Mobile** : slides vidéo WebM plein écran avec crossfade automatique

---

## 3. Curseur Personnalisé

**Fichier :** `CustomCursor.tsx`

- Curseur custom qui **remplace le curseur natif** sur desktop (`pointer: fine`)
- **Suivi fluide** avec `gsap.quickTo` (duration 0.7s, `power4.out`)
- **Distortion dynamique** selon la vitesse de la souris :
  - `skewX` proportionnel au déplacement horizontal
  - `scaleX` / `scaleY` selon la vélocité (étirement/compression)
  - `rotate` lié au delta X
- **Modes hover** :
  - `.hover-target` : grossissement + couleur orange
  - `.hover-view` : même effet + libellé "VOIR" injecté via `::after`

---

## 4. Galerie Circulaire WebGL

**Fichier :** `CircularGallery.tsx`

- **Moteur WebGL** (OGL) avec rendu canvas transparent
- **Courbe 3D** : les images suivent une trajectoire courbée configurable (`bend`) avec rotation Z automatique selon la position X
- **Défilement inertiel** : molette, drag tactile/souris, et flèches clavier
- **Boucle infinie** : les items se repositionnent automatiquement (`extra` offset)
- **Snap** : alignement automatique sur l'item le plus proche après l'arrêt
- **Détection de l'item actif** : callback `onActiveIndexChange` selon la proximité du centre
- **Clic** : détection du plan cliqué en coordonnées monde + navigation vers la fiche
- **Boutons** : `next()` / `prev()` exposés via `useImperativeHandle`

---

## 5. Rainbow Text Reveal

**Fichier :** `RainbowText.tsx`

- Reveal **lettre par lettre** synchronisé au scroll (ou immédiat pour le Hero)
- Chaque lettre traverse 3 états :
  1. **Fantôme** : couleur de la marque à 22% d'opacité
  2. **Flash arc-en-ciel** : une des 6 teintes vives (`#FF0055`, `#FF9900`, etc.)
  3. **Couleur finale** : teinte de marque pleine opacité
- **Halo pulsant** : `text-shadow` qui pulse pendant le passage arc-en-ciel
- Répartition temporelle : chaque mot occupe `1/N` de la timeline, ses lettres se partagent cette tranche

---

## 6. Micro-interaction Hover — V-FADE-X

**Fichier :** `HoverFadeText.tsx`

- Survol d'un lien/bouton : le texte **glisse vers la droite** et s'efface caractère par caractère (`SplitText`)
- **Copie identique** arrive de la gauche en même temps
- Au `mouseleave` : le timeline joue en `reverse()` pour un aller-retour symétrique
- Les deux copies sont `aria-hidden`, le libellé accessible vit sur le wrapper

---

## 7. Bouton Magnétique

**Fichier :** `MagneticButton.tsx`

- Le bouton **suit le curseur** dans la zone de son wrapper (force configurable, défaut 0.45)
- Déplacement fluide avec `gsap.to` (`power2.out`, 0.3s)
- Au `mouseleave` : retour à la position d'origine avec **ressort élastique** (`elastic.out(1, 0.3)`, 0.8s)
- Appliqué au CTA WhatsApp du footer

---

## 8. Bouton Contact Morphing

**Fichier :** `ContactMorphButton.tsx`

- **Même mécanique de ressort** que le footer (`STIFFNESS: 0.18`, `FRICTION: 0.65`)
- **État fermé** : bouton "Nous contacter" (210×56px)
- **État ouvert** : le bouton se réduit en rond (56×56px) et se positionne dans le coin du panneau de formulaire qui se déploie (360×480px)
- **Suivi magnétique** actif uniquement à l'état fermé (ne concurrence pas le morph)
- Fermeture au clic extérieur, envoi du formulaire via la même API que la page Contact

---

## 9. Section CTA — Iris Cinématique

**Fichier :** `CtaSection.tsx`

- **Effet d'iris** : le fond s'ouvre depuis le centre comme un diaphragme d'appareil photo
  - `clip-path: circle(0% → 70% → 130%)` piloté par `scrollYProgress`
- **Zoom subtil** du fond (`scale: 1.08 → 1`) synchronisé
- **Diagonal wipe** sur l'eyebrow : `clip-path` polygon qui balaie de gauche à droite
- Titre et sous-titres avec stagger d'entrée `whileInView`

---

## 10. Section "Pour Qui" — Blob Éclosion

**Fichier :** `PourQuiSection.tsx`

- 3 cartes plein écran avec image de fond
- **Effet d'éclosion** : l'image apparaît via `clip-path: circle(0% → 130%)` depuis le centre de la carte, avec délai stagger entre les 3 cartes
- Overlay dégradé pour la lisibilité du texte
- Texte qui apparaît en `fade + translateY` après l'éclosion de l'image

---

## 11. TrustMarquee — Bandes Sticker

**Fichier :** `TrustMarquee.tsx` + `TrustMarquee.css`

- **3 bandes en flux normal** (pas de `position: absolute` → pas de chevauchement)
- Chaque bande est **légèrement inclinée** en 2D (`rotate: -2.2deg`, `+2deg`, `-1.4deg`) avec ombre portée
- **Défilement infini** CSS (`translateX(-50%)`) en sens alterné (gauche / droite / gauche)
- **Pause au survol** de chaque bande
- Contenu : disponibilités, tarifs, zones de livraison

---

## 12. Navigation — CardNav (Desktop)

**Fichier :** `Navbar.tsx`

- **Carte dépliable** sous le header flottant
- Ouverture : expansion de hauteur avec `gsap.timeline` (`power3.inOut`) + stagger des 3 cartes internes (`power3.out`)
- Fermeture : reverse de la timeline
- Fond glassmorphism (`backdrop-filter: blur`) avec bordure caramel

---

## 13. Navigation — StaggeredMenu (Mobile)

**Fichier :** `Navbar.tsx`

- **Overlay plein écran** qui glisse depuis la droite (`xPercent: 100 → 0`)
- **Rideaux de pré-couche** : 2 bandes de couleur qui balaient l'écran avant l'apparition du panel
- **Stagger sur les items** : chaque lien arrive avec `yPercent: 130 → 0` + `rotate: 8° → 0°`, stagger 0.06s
- **Icône hamburger** : rotation de 0° à 225° avec morphing du texte "Menu → Fermer"

---

## 14. Témoignages — Carousel Auto

**Fichier :** `TestimonialsSection.tsx`

- Défilement automatique toutes les 5 secondes
- **Pause au survol** (`mouseenter/mouseleave`)
- Transition de carte avec classe CSS `is-active`
- Dots de navigation cliquables

---

## 15. Marquee Scroll-Velocity

**Fichier :** `MarqueeBanner.tsx`

- Bande de texte qui défile en boucle infinie (GSAP `xPercent: -50`)
- **TimeScale dynamique** : la vitesse s'accélère ou s'inverse selon la vélocité du scroll sur la section `#histoire`
  - `timeScale = velocity / 150 + 1`
- Lissage fluide avec `gsap.to(tween, { duration: 0.2 })`

---

## 16. Révélation de Texte — "reveal-text"

**Fichiers :** `HistoireSection.tsx`, `MissionSection.tsx`, etc.

- Classe CSS utilitaire `.reveal-text` appliquée sur les blocs de texte
- Apparition au scroll via `ScrollTrigger` (configuré dans `useGsapLenis.ts`)
- Effet de **montée progressive** avec opacité

---

## 17. Animations Framer Motion

**Fichiers :** `AboutSection.tsx`, `ContactSection.tsx`, `TopCollectionSection.tsx`, `Logo.tsx`

- Entrées `whileInView` avec `initial={{ opacity: 0, y: 30 }}` → `animate` avec stagger
- **Logo** : animation d'entrée spring (`stiffness: 200, damping: 15`) + hover (`rotate: 4°, scale: 1.06`)
- **Cartes** : hover `whileHover={{ x: 4 }}` avec spring physique

---

## 18. RéserveButton — Morphing Expansion

**Fichier :** `ReserveButton.tsx`

- **Même moteur de ressort** que ContactMorphButton (`STIFFNESS: 0.18`, `FRICTION: 0.65`)
- Clic 1 : expansion du panneau (hauteur + opacité) révélant le sélecteur de quantité et les champs d'identité
- Clic 2 : validation et envoi de la réservation
- Re-mesure automatique de la hauteur cible si le contenu change (ex. message "Stock max atteint")

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

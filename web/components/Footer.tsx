// Redirection — le composant vit maintenant dans AdoptSection.tsx
// (marque + nav + colonne contact + barre copyright + bloc Commandez,
// tout fusionné). Gardé ici pour ne pas casser les imports existants
// ailleurs dans le projet (/aide, /admin, /rabbits/[slug]…). Supprimable
// dès que tous les imports pointent directement vers AdoptSection.
export { default } from './AdoptSection'
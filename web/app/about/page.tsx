// web/app/about/page.tsx
// La page /about est fusionnée avec la page d'accueil.
// On redirige vers #a-propos sur la home.
import { redirect } from 'next/navigation'

export default function AboutRedirect() {
  redirect('/#a-propos')
}

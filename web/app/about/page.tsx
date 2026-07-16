// web/app/about/page.tsx
// La page /about est fusionnée avec la page d'accueil.
// On redirige vers #histoire sur la home (No. 02 — Notre Histoire).
import { redirect } from 'next/navigation'

export default function AboutRedirect() {
  redirect('/#histoire')
}

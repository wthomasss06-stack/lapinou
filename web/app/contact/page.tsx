// web/app/contact/page.tsx
// La page /contact est fusionnée avec la page d'accueil.
// On redirige vers #contact sur la home.
import { redirect } from 'next/navigation'

export default function ContactRedirect() {
  redirect('/#contact')
}

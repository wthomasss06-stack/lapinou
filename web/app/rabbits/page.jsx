// web/app/rabbits/page.jsx
// La page /rabbits est fusionnée avec la page d'accueil.
// On redirige vers #lapins sur la home.
import { redirect } from 'next/navigation'

export default function RabbitsRedirect() {
  redirect('/#lapins')
}

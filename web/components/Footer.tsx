'use client'
import Link from 'next/link'
import RainbowText from './RainbowText'
import MapView from './MapView'
import ContactMorphButton from './ContactMorphButton'
import HoverFadeText from './HoverFadeText'
import LetterHoverTitle from './LetterHoverTitle'
import BunnyFountain from './BunnyFountain'
import { CHEZ_FLORENCE_LETTER_IMAGES } from '@/lib/chezFlorenceLetters'
import { cld } from '@/lib/cloudinary'
import './Footer.css'

const LOADER_BUNNY_IMAGES = [
  cld('/IMAGES/loader/bunny-marble.png'),
  cld('/IMAGES/loader/bunny-purple.webp'),
  cld('/IMAGES/loader/bunny-red.webp'),
  cld('/IMAGES/loader/bunny-rust.webp'),
  cld('/IMAGES/loader/bunny-amber.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/k.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/kkkk.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ll.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/llllllll.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/p.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/v.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/www.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/b.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/BB.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/bbb.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/bunny-amberB.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_07_14DDD.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_17_17hh.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_17_24bb.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_19_56.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_20_16.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_20_26.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_43_11.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_45_34.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_46_57.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_50_53.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_53_20.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_06_25.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_08_38.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_10_07.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_13_22.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32ddddddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32gggg.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32ssss.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32xxxx.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05ddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05ssss.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05xx.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05zzzz.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_23_18cccc.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_23_18xx.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_34_26nnnnnn.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_34_26zzz.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54ooo.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54v.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32aaaaa.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32bbbbll.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32qq.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47ccc.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47ddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47hhhhh.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47qqq.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47sssss.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47vvvvv.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47bbbbb.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47m.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47nn.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47nnnnnn.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ddddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/dddddddddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/h.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/hh.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/HHHH.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/jjjj.webp'),
]

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
const waHref = WHATSAPP ? `https://wa.me/${WHATSAPP}` : '#'

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos Lapins', href: '/#lapins' },
  { label: 'Tarifs', href: '/#tarifs' },
  { label: 'Notre Histoire', href: '/#histoire' },
  { label: 'FAQ', href: '/#faq' },
]
const INFO_LINKS = [
  { label: 'Aide', href: '/aide' },
  { label: 'Conditions Générales', href: '/conditions' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

// Footer unique du site — structure reprise de footer.html (AKATech) :
// grille de nav (Navigation/Informations/Action) sur fond dégradé, gros
// lettrage en dégradé métallique. Les liens Aide/Conditions/Confidentialité
// vivent ici désormais (déplacés depuis la carte "Informations" de la nav).
export default function Footer() {
  return (
    <footer id="contact">
      <BunnyFountain images={LOADER_BUNNY_IMAGES} />
      <div className="footer-main">
        <h2 className="footer-title elastic-title">Parlons de<br />votre lapin.</h2>
        <RainbowText
          text="Une question sur une race, un prix, une disponibilité ? Écrivez-nous — on vous répond vite."
          variant="white"
          className="footer-sub"
        />

        <div className="footer-grid">
          {/* Colonne info + localisation — le bouton WhatsApp qui vivait ici
              est parti en colonne droite, devenu ContactMorphButton */}
          <div className="footer-info-col">
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-label">Email</div>
                <div className="contact-value">
                  <a href="mailto:wthomasss06@gmail.com" className="hover-target">wthomasss06@gmail.com</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-label">WhatsApp</div>
                <div className="contact-value">
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="hover-target">+225 01 42 50 77 50</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-label">Horaires</div>
                <div className="contact-value">Lun–Ven 8h–18h · Sam 9h–14h</div>
              </div>
            </div>
          </div>

          {/* Bouton magnétique → formulaire de contact, en face des
              coordonnées de la colonne gauche. Ex-bouton WhatsApp. */}
          <div className="footer-contact-col">
            <ContactMorphButton />
          </div>
        </div>

        {/* Grille de navigation — port de .nav-grid (footer.html) */}
        <div className="footer-nav-grid">
          <div className="footer-nav-col">
            <h3>Navigation</h3>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover-target"><HoverFadeText>{l.label}</HoverFadeText></Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-nav-col">
            <h3>Informations</h3>
            <ul>
              {INFO_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover-target"><HoverFadeText>{l.label}</HoverFadeText></Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-nav-col footer-nav-action">
            <h3>Commander</h3>
            <div className="footer-map-card">
              <MapView />
            </div>
          </div>
        </div>

        <div className="footer-giant-type footer-giant-type--interactive">
          <LetterHoverTitle
            as="div"
            text="CHEZ"
            letterImages={CHEZ_FLORENCE_LETTER_IMAGES}
            className="footer-giant-line"
          />
          <LetterHoverTitle
            as="div"
            text="FLORENCE"
            letterImages={CHEZ_FLORENCE_LETTER_IMAGES}
            className="footer-giant-line"
          />
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 Chez Florence — Tous droits réservés · Créé par{' '}
          <a href="https://akatech.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover-target">AKATech Studio</a>
        </p>
      </div>
    </footer>
  )
}
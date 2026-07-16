// web/components/ContactSection.tsx
// Contenu "Contact" — fusionné dans la landing page (anciennement /contact)
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { sendContactMessage } from '@/lib/api'
import { formatWhatsappDisplay } from '@/lib/whatsapp'
import RainbowText from './RainbowText'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendContactMessage(form)
      setSent(true)
      toast.success('Message envoyé ! Nous vous répondrons rapidement.')
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'envoi. Réessayez ou contactez-nous sur WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const whatsappUrl = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Bonjour, j\'aimerais avoir plus d\'informations sur vos lapins.')}`
    : null

  const contactInfo = [
    { icon: <Mail size={20} />, label: 'Email', value: 'wthomasss06@gmail.com' },
    { icon: <MessageCircle size={20} />, label: 'WhatsApp', value: WHATSAPP ? formatWhatsappDisplay(WHATSAPP) : 'Voir le bouton ci-contre' },
    { icon: <MapPin size={20} />, label: 'Adresse', value: 'Abidjan, Côte d\'Ivoire' },
  ]

  return (
    <section id="contact" className="py-20 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header — pas de motion.div ici : le giant-heading (SplitText/3D-flip,
            voir lib/useGsapLenis.ts) et RainbowText ont chacun leur PROPRE
            reveal au scroll. Les envelopper dans un whileInView opacity:0→1
            les cachait pendant que ces reveals tournaient dessous ; le
            temps que whileInView se déclenche, les deux avaient déjà fini
            en silence et n'apparaissaient plus qu'en état final, figé. */}
        <div className="text-center mb-16">
          <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Nous Contacter</p>
          <h2 className="giant-heading split-heading-1 max-w-3xl mx-auto mb-4">
            Parlons de Votre Lapin
          </h2>
          <RainbowText
            text="Une question sur une race, un prix, une disponibilité ? Écrivez-nous."
            variant="white"
            className="max-w-2xl mx-auto"
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="glass rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center text-caramel shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">{info.label}</p>
                  <p className="text-white font-medium text-sm">{info.value}</p>
                </div>
              </div>
            ))}

            {/* WhatsApp direct CTA */}
            {whatsappUrl && (
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon w-full py-4 rounded-2xl text-center flex items-center justify-center gap-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={16} />
                Écrire directement sur WhatsApp
              </motion.a>
            )}

            {/* Hours */}
            <div className="glass rounded-2xl p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">Horaires</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Lun – Ven</span>
                  <span className="text-caramel">8h – 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Samedi</span>
                  <span className="text-caramel">9h – 14h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Dimanche</span>
                  <span className="text-white/30">Fermé</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-2xl p-8">
              {sent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle size={56} className="text-caramel mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Message Envoyé !</h3>
                  <p className="text-white/40">Nous vous répondrons dans les 24 heures.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-2 block">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-2 block">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        placeholder="jean@exemple.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-2 block">Sujet</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                      placeholder="Question sur un lapin..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-2 block">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
                      placeholder="Décrivez votre demande..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-neon w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {loading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-brand-dark/40 border-t-brand-dark rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <>
                        <Send size={16} />
                        Envoyer le Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

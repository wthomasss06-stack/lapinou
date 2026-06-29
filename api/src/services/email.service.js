// api/src/services/email.service.js
// Inspiré directement de Nexura backend/apps/core/email_service.py
// Gère : confirmation acheteur + alerte vendeur (admin)

const { Resend } = require('resend')
const config     = require('../config/env')

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null

// ─── Templates ────────────────────────────────────────────────────────────────

function templateConfirmationAcheteur(reservation, rabbit) {
  // WAVE_NUMBER_NEXURA → format wa.me (strip les espaces/tirets)
  const rawNum = config.whatsappNumber?.replace(/\D/g, '')
  const whatsappUrl = rawNum
    ? `https://wa.me/${rawNum}?text=${encodeURIComponent(
        `Bonjour, j'ai réservé ${rabbit.name} (réf: ${reservation.id.slice(0, 8)}). Quand peut-on se voir ?`
      )}`
    : null

  return {
    subject: `Réservation confirmée — ${rabbit.name} 🐇`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h1 style="font-size: 24px; margin-bottom: 8px;">Votre réservation est bien reçue ✅</h1>
  <p style="color: #555;">Merci <strong>${reservation.firstName}</strong> ! Nous avons bien enregistré votre demande.</p>

  <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 24px 0;">
    <h2 style="font-size: 16px; margin: 0 0 12px;">Récapitulatif</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 4px 0; color: #666;">Lapin</td><td style="font-weight: 600;">${rabbit.name} — ${rabbit.breed}</td></tr>
      <tr><td style="padding: 4px 0; color: #666;">Prix</td><td>${rabbit.price.toLocaleString('fr-FR')} FCFA</td></tr>
      <tr><td style="padding: 4px 0; color: #666;">Référence</td><td style="font-family: monospace; font-size: 12px;">${reservation.id}</td></tr>
    </table>
  </div>

  <p>Le vendeur vous contactera bientôt pour confirmer le rendez-vous.</p>

  ${whatsappUrl ? `
  <a href="${whatsappUrl}"
     style="display: inline-block; background: #25D366; color: #fff; text-decoration: none;
            padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 8px;">
    💬 Contacter via WhatsApp
  </a>
  ` : ''}

  <p style="color: #999; font-size: 12px; margin-top: 32px;">
    Rabbit Shop · Si vous avez une question, répondez à cet email.
  </p>
</body>
</html>`,
  }
}

function templateAlerteVendeur(reservation, rabbit) {
  return {
    subject: `Nouvelle réservation — ${rabbit.name} (${reservation.firstName} ${reservation.lastName})`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h1 style="font-size: 20px;">🐇 Nouvelle réservation</h1>

  <div style="background: #fff3cd; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
    <strong>${rabbit.name}</strong> (${rabbit.breed}) est maintenant marqué comme <strong>réservé</strong>.
  </div>

  <h2 style="font-size: 16px;">Acheteur</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 4px 0; color: #666; width: 120px;">Nom</td><td>${reservation.firstName} ${reservation.lastName}</td></tr>
    <tr><td style="padding: 4px 0; color: #666;">Email</td><td><a href="mailto:${reservation.email}">${reservation.email}</a></td></tr>
    <tr><td style="padding: 4px 0; color: #666;">Téléphone</td><td><a href="tel:${reservation.phone}">${reservation.phone}</a></td></tr>
    ${reservation.message ? `<tr><td style="padding: 4px 0; color: #666;">Message</td><td>${reservation.message}</td></tr>` : ''}
  </table>

  <h2 style="font-size: 16px; margin-top: 24px;">Actions</h2>
  <p>Connectez-vous au panneau admin pour confirmer ou annuler cette réservation.</p>

  <p style="color: #999; font-size: 12px; margin-top: 32px;">
    Réf : ${reservation.id}
  </p>
</body>
</html>`,
  }
}

// ─── Envoi ────────────────────────────────────────────────────────────────────

async function sendReservationEmails(reservation, rabbit) {
  if (!resend) {
    console.warn('[email] Resend non configuré — emails non envoyés')
    return
  }

  const results = await Promise.allSettled([
    // 1. Confirmation à l'acheteur
    resend.emails.send({
      from: config.emailFrom,
      to:   reservation.email,
      ...templateConfirmationAcheteur(reservation, rabbit),
    }),

    // 2. Alerte au vendeur/admin
    config.adminEmail
      ? resend.emails.send({
          from: config.emailFrom,
          to:   config.adminEmail,
          ...templateAlerteVendeur(reservation, rabbit),
        })
      : Promise.resolve({ skipped: true }),
  ])

  for (const [i, result] of results.entries()) {
    const target = i === 0 ? 'acheteur' : 'vendeur'
    if (result.status === 'fulfilled') {
      console.log(`[email] ✓ Envoyé (${target})`)
    } else {
      console.error(`[email] ✗ Échec (${target}):`, result.reason)
    }
  }
}

// ─── Contact (formulaire site) ─────────────────────────────────────────────────

function templateContact({ name, email, subject, message }) {
  return {
    subject: `Nouveau message contact — ${subject || 'Sans sujet'}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h1 style="font-size: 20px;">🐇 Nouveau message depuis le site Lapinou</h1>

  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 4px 0; color: #666; width: 100px;">Nom</td><td>${name}</td></tr>
    <tr><td style="padding: 4px 0; color: #666;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
    ${subject ? `<tr><td style="padding: 4px 0; color: #666;">Sujet</td><td>${subject}</td></tr>` : ''}
  </table>

  <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin-top: 16px;">
    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
  </div>

  <p style="color: #999; font-size: 12px; margin-top: 32px;">
    Répondez directement à cet email pour contacter ${name}.
  </p>
</body>
</html>`,
  }
}

async function sendContactEmail({ name, email, subject, message }) {
  if (!resend || !config.adminEmail) {
    console.warn('[email] Resend ou ADMIN_EMAIL non configuré — message contact non envoyé')
    return
  }

  await resend.emails.send({
    from:    config.emailFrom,
    to:      config.adminEmail,
    replyTo: email,
    ...templateContact({ name, email, subject, message }),
  })

  console.log('[email] ✓ Message contact envoyé à l\'admin')
}

module.exports = { sendReservationEmails, sendContactEmail }

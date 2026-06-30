// api/src/services/email.service.js
// Notification vendeur uniquement — pas d'email au client
// Le client contacte le vendeur directement via WhatsApp

const { Resend } = require('resend')
const config     = require('../config/env')

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null

// ─── Templates ────────────────────────────────────────────────────────────────

const DELIVERY_LABELS = {
  abidjan:      'Abidjan',
  azaguie:      'Azaguié et alentours',
  pays_profond: 'Reste de la Côte d\'Ivoire',
}

function templateAlerteVendeur(reservation, rabbit) {
  const quantity = reservation.quantity ?? 1
  const subtotal = rabbit.price * quantity
  const hasDelivery = reservation.deliveryZone && reservation.deliveryFee != null
  const total = subtotal + (hasDelivery ? reservation.deliveryFee : 0)
  const waText = encodeURIComponent(
    `Bonjour ${reservation.firstName} ! Je suis le vendeur de Lapinou 🐇. Vous avez réservé ${quantity} ${rabbit.name}${quantity > 1 ? 's' : ''}. Quand seriez-vous disponible pour le rendez-vous ?`
  )
  const rawPhone = reservation.phone.replace(/\D/g, '')
  const waLink = `https://wa.me/${rawPhone}?text=${waText}`

  return {
    subject: `🐇 Nouvelle réservation — ${rabbit.name} ×${quantity} · ${reservation.firstName} ${reservation.lastName}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#1a0a00,#3d1a00);padding:32px 40px;">
    <h1 style="margin:0;color:#B8834A;font-size:22px;font-weight:700;">🐇 Lapinou — Nouvelle réservation</h1>
    <p style="margin:8px 0 0;color:#fff8;font-size:14px;">Un client souhaite acquérir ${quantity} lapin${quantity > 1 ? 's' : ''}</p>
  </td></tr>

  <!-- Rabbit info -->
  <tr><td style="padding:32px 40px 0;">
    <div style="background:#fff8f0;border:1px solid #B8834A33;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <h2 style="margin:0 0 4px;font-size:18px;color:#1a1a1a;">${rabbit.name}</h2>
      <p style="margin:0;color:#666;font-size:14px;">${rabbit.breed} · ${rabbit.price.toLocaleString('fr-FR')} FCFA/unité</p>
      <p style="margin:6px 0 0;font-size:14px;font-weight:700;color:#B8834A;">Quantité : ${quantity} → ${subtotal.toLocaleString('fr-FR')} FCFA</p>
      ${hasDelivery ? `<p style="margin:6px 0 0;font-size:13px;color:#B8834A;">Livraison : ${DELIVERY_LABELS[reservation.deliveryZone] || reservation.deliveryZone} — ${reservation.deliveryFee.toLocaleString('fr-FR')} FCFA</p>` : ''}
      <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#1a1a1a;">Total : ${total.toLocaleString('fr-FR')} FCFA</p>
    </div>
  </td></tr>

  <!-- Buyer info -->
  <tr><td style="padding:0 40px;">
    <h3 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;margin:0 0 12px;">Coordonnées client</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;width:120px;">Prénom / Nom</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:14px;">${reservation.firstName} ${reservation.lastName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;">Email</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;"><a href="mailto:${reservation.email}" style="color:#B8834A;">${reservation.email}</a></td>
      </tr>
      <tr>
        <td style="padding:8px 0;${reservation.message ? 'border-bottom:1px solid #f0f0f0;' : ''}color:#888;font-size:13px;">Téléphone</td>
        <td style="padding:8px 0;${reservation.message ? 'border-bottom:1px solid #f0f0f0;' : ''}font-size:14px;font-weight:600;"><a href="tel:${reservation.phone}" style="color:#1a1a1a;text-decoration:none;">${reservation.phone}</a></td>
      </tr>
      ${reservation.message ? `<tr>
        <td style="padding:8px 0;color:#888;font-size:13px;vertical-align:top;">Message</td>
        <td style="padding:8px 0;font-size:14px;color:#444;font-style:italic;">${reservation.message}</td>
      </tr>` : ''}
    </table>
  </td></tr>

  <!-- CTA WhatsApp -->
  <tr><td style="padding:28px 40px;">
    <a href="${waLink}"
       style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;
              padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;width:100%;
              box-sizing:border-box;text-align:center;">
      💬 Contacter ${reservation.firstName} sur WhatsApp
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee;">
    <p style="margin:0;font-size:12px;color:#aaa;">Réf. réservation : <code>${reservation.id}</code></p>
    <p style="margin:4px 0 0;font-size:12px;color:#aaa;">Lapinou · Azaguié Gare, Côte d'Ivoire</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  }
}

// ─── Envoi ────────────────────────────────────────────────────────────────────
// Seul l'admin (vendeur) reçoit un email — pas de notification au client

async function sendReservationEmails(reservation, rabbit) {
  if (!resend) {
    console.warn('[email] Resend non configuré — email non envoyé')
    return
  }
  if (!config.adminEmail) {
    console.warn('[email] ADMIN_EMAIL non configuré — email non envoyé')
    return
  }

  try {
    await resend.emails.send({
      from: config.emailFrom,
      to:   config.adminEmail,
      ...templateAlerteVendeur(reservation, rabbit),
    })
    console.log('[email] ✓ Notification vendeur envoyée')
  } catch (err) {
    console.error('[email] ✗ Échec notification vendeur:', err)
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

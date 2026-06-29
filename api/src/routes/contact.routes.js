// api/src/routes/contact.routes.js
const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const { sendContactEmail } = require('../services/email.service')

const contactRules = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('message').trim().notEmpty().withMessage('Le message est requis'),
]

router.post('/', contactRules, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg })
    }

    const { name, email, subject, message } = req.body
    await sendContactEmail({ name, email, subject, message })

    res.status(201).json({ ok: true })
  } catch (err) { next(err) }
})

module.exports = router

// api/src/validations/reservation.schema.js
// Pattern Nexura validations/

const { body, validationResult } = require('express-validator')

const reservationRules = [
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Quantité invalide (1 à 50)')
    .toInt(),
  body('firstName').trim().notEmpty().withMessage('Prénom requis'),
  body('lastName').trim().notEmpty().withMessage('Nom requis'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('phone')
    .trim()
    .notEmpty()
    .matches(/^[+\d\s\-().]{7,20}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('message').optional().trim().isLength({ max: 500 }),
  // { nullable: true } : express-validator v7 ne skip la validation que si la valeur
  // est undefined. Sans ça, envoyer latitude: null (cas quand le GPS n'est pas dispo)
  // fait échouer isFloat() sur la chaîne "null" → 400 Bad Request systématique.
  body('latitude').optional({ nullable: true }).isFloat().toFloat(),
  body('longitude').optional({ nullable: true }).isFloat().toFloat(),
]

function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

module.exports = { reservationRules, validate }

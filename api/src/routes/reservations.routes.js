// api/src/routes/reservations.routes.js  (admin)
const router = require('express').Router()
const ctrl   = require('../controllers/reservations.controller')
const adminAuth = require('../middlewares/adminAuth.middleware')

router.use(adminAuth)

router.get('/',                    ctrl.list)
router.patch('/:id/confirm',       ctrl.confirm)
router.patch('/:id/cancel',        ctrl.cancel)
router.patch('/:id/sold',          ctrl.sold)

module.exports = router

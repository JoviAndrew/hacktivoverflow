const router = require('express').Router()
const notif = require('../controllers/notif_controller')

router.post('/send', notif.sendNotif)

module.exports = router
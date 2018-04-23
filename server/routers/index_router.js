const router = require('express').Router()
const index = require('../controllers/index_controller')

//Login
router.post('/login', index.doLogin)

//Register
router.post('/register', index.doRegister)

module.exports = router
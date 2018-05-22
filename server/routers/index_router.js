const router = require('express').Router()
const index = require('../controllers/index_controller')

//Login
router.post('/login', index.doLogin)

//Register
router.post('/register', index.doRegister)

//Login
router.post('/login-fb', index.loginFb)

module.exports = router
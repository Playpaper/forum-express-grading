const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router

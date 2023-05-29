const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

const userController = {
  signupPage: (req, res) => {
    return res.render('signup')
  },
  signup: async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10)
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash
    })
    res.redirect('/signin')
  }
}

module.exports = userController

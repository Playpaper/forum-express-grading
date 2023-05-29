const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email', // change to email
    passwordField: 'password',
    passReqToCallback: true // return error message
  },
  // authenticate user
  async (req, email, password, cb) => {
    const user = await User.findOne({ where: { email } })
    // can't find user
    if (!user) return cb(null, false, req.flash('error_message', '帳號或密碼輸入錯誤！'))
    // not match to db password
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    return cb(null, user)
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  const user = await User.findByPk(id)
  return cb(null, user.toJSON())
})
module.exports = passport

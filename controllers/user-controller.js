const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

const userController = {
  signupPage: (req, res) => {
    return res.render('signup')
  },
  signup: async (req, res, next) => {
    try {
      // Error : 兩次輸入的密碼不同
      if (req.body.password !== req.body.passwordCheck) throw new Error('Password don\'t match !')
      const user = await User.findOne({ where: { email: req.body.email } })
      // Error: email 已存在
      if (user) throw new Error('Email already exists !')
      // 密碼加密, 寫入 DB
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      // Messages: 註冊成功 | Redirect: signin
      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

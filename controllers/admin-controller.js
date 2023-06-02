const { Restaurant } = require('../models')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error('Restaurant didn\'t exist !')
      return res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  creatRestaurant: (req, res) => {
    const restaurant = req.session.formData
      ? { ...req.session.formData }
      : {}
    delete req.session.formData // 清除 session 資料
    return res.render('admin/create-restaurant', { restaurant })
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.session.formData = req.body
      if (!name) throw new Error('Restaurant name is required !')
      const { file } = req // 把檔案取出來，也可以寫成 const file = req.file
      const filePath = await imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      await Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null })
      req.flash('success_messages', 'Restaurant created !')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error('Restaurant didn\'t exist !')
      return res.render('admin/edit-restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req
      const [filePath, restaurant] = await Promise.all([
        imgurFileHandler(file),
        Restaurant.findByPk(req.params.id)
      ])
      await restaurant.update({ name, tel, address, openingHours, description, image: filePath || null })
      req.flash('success_messages', 'Restaurant updated !')
      // await restaurant.set({ name, tel, address, openingHours, description })
      // await restaurant.save()
      return res.redirect(`/admin/restaurants/${req.params.id}`)
    } catch (err) {
      next(err)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error('Restaurant didn\'t exist !')
      await restaurant.destroy()
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('User didn\'t exist !')
      // if (user.email === 'root@example.com') throw new Error('禁止變更 root 權限') // 測試不給過
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController

const { Restaurant } = require('../models')
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
    return res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required !')
      await Restaurant.create({ name, tel, address, openingHours, description })
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
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.update({ name, tel, address, openingHours, description })
      // await restaurant.set({ name, tel, address, openingHours, description })
      // await restaurant.save()
      return res.redirect('/admin/restaurant')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController

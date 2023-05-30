module.exports = {
  getUser: req => {
    return req.user || null
  },
  ensureAuthenticated: req => {
    return req.isAuthenticated()
  }
}

// const getUser = req => {
//   return req.user || null
// }
// const ensureAuthenticated = req => {
//   return req.isAuthenticated()
// }
// module.exports = {
//   getUser,
//   ensureAuthenticated
// }

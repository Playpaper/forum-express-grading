module.exports = {
  getUser: req => {
    return req.user || null
  }
}

// const getUser = req => {
//   return req.user || null
// }
// module.exports = {
//   getUser
// }

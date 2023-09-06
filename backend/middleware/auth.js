// const jwt = require('jsonwebtoken')

// module.exports = (req, res, next) => {
//   try {
//     //Donc on voit grace au network que pour le token il y bearer token donc nous on veut uniquement le token
//     const token = req.headers.authorization.split(' ')[1] //Uniquement le token
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') // decoder le token
//     const userId = decodedToken.userId
//     req.auth = {
//       userId: userId,
//     }
//     next()
//   } catch (error) {
//     res.status(401).json({ error })
//   }
// }
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    console.log('Headers:', req.headers)

    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
    const userId = decodedToken.userId
    console.log('Token:', token)
    console.log('Decoded Token:', decodedToken)
    console.log('User ID:', userId)

    req.auth = {
      userId: userId,
    }
    next()
  } catch (error) {
    console.log('Middleware Error:', error)
    res.status(401).json({ error: error.message })
  }
}

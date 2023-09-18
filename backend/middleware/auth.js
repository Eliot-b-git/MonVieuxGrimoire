// const jwt = require('jsonwebtoken')

// module.exports = (req, res, next) => {
//   try {
//     //Donc on voit grace au network que pour le token il y bearer token donc nous on veut uniquement le token
//     const token = req.headers.authorization.split(' ')[1] //Uniquement le token
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') // decoder le token
//     const userId = decodedToken.userId
//     req.auth = {
//       userId: userId, vérifie que sa soit bien le bon userId
//     }
//     next()
//   } catch (error) {
//     res.status(401).json({ error })
//   }
// }
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        // Vérification de la présence du header `authorization`
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'No token provided' })
        }

        // Extrait le token du header `authorization`
        // Le format attendu est "Bearer [token]"
        const token = req.headers.authorization.split(' ')[1]

        // Vérifie la validité du token avec la clé secrète
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')

        // Extrait l'ID de l'utilisateur du token décodé
        const userId = decodedToken.userId

        req.auth = {
            userId: userId,
        }

        next()
    } catch (error) {
        console.log('Middleware Error:', error)
        res.status(401).json({ error: error.message })
    }
}

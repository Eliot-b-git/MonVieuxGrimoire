const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const User = require('../models/User')

exports.signup = (req, res, next) => {
    // Hache le mot de passe fourni par l'utilisateur
    bcrypt
        .hash(req.body.password, 10) // Le "10" est le nombre de tours de salage
        .then((hash) => {
            // Crée un nouvel utilisateur avec l'e-mail et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash,
            })
            // Sauvegarde l'utilisateur dans la base de données
            user.save()
                .then(() =>
                    res.status(201).json({ message: 'Utilisateur créé !' }),
                )
                .catch((error) => res.status(400).json({ error }))
        })
        .catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    // Recherche un utilisateur avec l'e-mail fourni
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                console.log('User not found')
                return res
                    .status(401)
                    .json({ message: 'Paire login/mot de passe incorrecte' })
            }
            console.log('User found:', user)

            // Compare le mot de passe fourni avec le mot de passe haché stocké dans la base de données
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        console.log('Invalid password')
                        return res.status(401).json({
                            message: 'Paire login/mot de passe incorrecte',
                        })
                    }
                    // Si tout est correct, génère un JWT pour l'utilisateur
                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        {
                            expiresIn: '24h',
                        },
                    )
                    console.log('Generated token:', token)
                    // Renvoie l'ID de l'utilisateur et le token au client
                    res.status(200).json({
                        userId: user._id,
                        token: token,
                    })
                })
                .catch((error) => {
                    console.log('Error during password comparison:', error)
                    res.status(500).json({ error })
                })
        })
        .catch((error) => {
            console.log('Error during user search:', error)
            res.status(500).json({ error })
        })
}

const Book = require('../models/Books')
const multer = require('multer')
const fs = require('fs')
const upload = multer()
const sharp = require('sharp')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now()
        req.timestamp = timestamp // stocker le timestamp dans req pour pouvoir y accéder plus tard
        cb(null, file.originalname + timestamp + '.jpg')
    },
})

exports.createBook = async (req, res, next) => {
    console.log('Create Book Route Hit')
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
    })

    // Chemin de l'image d'origine
    const originalImagePath = req.file.path
    console.log(originalImagePath)

    // Chemin de l'image redimensionnée et convertie
    const newImagePath = 'images/' + req.file.filename + req.timestamp + '.webp'

    // Redimensionner et convertir l'image
    try {
        await sharp(originalImagePath).resize(2000).webp().toFile(newImagePath)
        book.imageUrl = `${req.protocol}://${req.get('host')}/${newImagePath}`
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({ error: "Erreur lors du redimensionnement de l'image" })
    }

    // Supprimer l'image d'origine
    fs.unlink(originalImagePath, (err) => {
        if (err) {
            console.error(
                "Erreur lors de la suppression de l'image d'origine",
                err,
            )
            return res.status(500).json({
                error: "Erreur lors de la suppression de l'image d'origine",
            })
        }
    })

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Objet enregistré !' })
        })
        .catch((error) => {
            console.error(error)
            res.status(400).json({ error })
        })
}

exports.modifyBook = async (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)

    // Récupérer l'ancienne image à partir de la base de données
    const book = await Book.findOne({ _id: req.params.id })

    const oldImageUrl = book.imageUrl
    const oldImagePath = oldImageUrl.replace(
        `${req.protocol}://${req.get('host')}/`,
        '',
    )

    // Supprimer l'ancienne image du système de fichiers
    fs.unlink(oldImagePath, (err) => {
        if (err) {
            console.error(
                "Erreur lors de la suppression de l'ancienne image",
                err,
            )
        }
    })

    // Chemin de l'image d'origine
    const originalImagePath = req.file.path

    // Chemin de l'image redimensionnée et convertie
    const newImagePath = 'images/' + req.file.filename + req.timestamp + '.webp'

    // Redimensionner et convertir l'image
    try {
        await sharp(originalImagePath).resize(2000).webp().toFile(newImagePath)
        bookObject.imageUrl = `${req.protocol}://${req.get(
            'host',
        )}/${newImagePath}`
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({ error: "Erreur lors du redimensionnement de l'image" })
    }

    // Supprimer l'image d'origine
    fs.unlink(originalImagePath, (err) => {
        if (err) {
            console.error(
                "Erreur lors de la suppression de l'image d'origine",
                err,
            )
            return res
                .status(500)
                .json({
                    error: "Erreur lors de la suppression de l'image d'origine",
                })
        }
    })

    Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id },
    )
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch((error) => res.status(400).json({ error }))
}

//
exports.deleteBook = (req, res, next) => {
    // Recherche du livre par son ID dans la base de données
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Vérification de l'autorisation : assurez-vous que l'utilisateur qui tente de supprimer le livre en est bien le propriétaire
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' })
            } else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'Objet supprimé !',
                            })
                        })
                        .catch((error) => res.status(401).json({ error }))
                })
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }))
}

exports.getAllBook = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }))
}

exports.rateBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé!' })
            }

            const hasRated = book.ratings.some(
                (r) => r.userId === req.body.userId,
            )
            if (hasRated) {
                return res
                    .status(400)
                    .json({ message: 'L’utilisateur a déjà noté ce livre.' })
            }

            book.ratings.push({
                userId: req.body.userId,
                grade: req.body.rating,
            })

            // Mettre à jour la note moyenne
            book.averageRating =
                book.ratings.reduce((acc, cur) => acc + cur.grade, 0) /
                book.ratings.length

            return book.save()
        })
        .then((updatedBook) => res.status(200).json(updatedBook))
        .catch((error) => {
            console.log(error)
            return res.status(400).json({ error })
        })
}

exports.getBestRatingBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }))
}

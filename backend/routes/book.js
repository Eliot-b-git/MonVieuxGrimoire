const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const stuffCtrl = require('../controllers/book')

router.get('/', stuffCtrl.getAllBook)

// Quand la requete est envoie le middlaware auth est executée est vérifie si l'utilisateur est connecter
// Ensuite si authentifié multer est exécuté pour gérer les éventuels fichiers téléchargés dans la requête
// Enfin, si tout se passe bien, la méthode createBook du module stuffCtrl est exécutée pour traiter la requête et ajouter le livre.
router.post('/', auth, multer, stuffCtrl.createBook)

router.post('/:id/rating', auth, stuffCtrl.rateBook)

router.get('/bestrating', stuffCtrl.getBestRatingBooks)

router.get('/:id', stuffCtrl.getOneBook)

router.put('/:id', auth, multer, stuffCtrl.modifyBook)

router.delete('/:id', auth, stuffCtrl.deleteBook)

module.exports = router

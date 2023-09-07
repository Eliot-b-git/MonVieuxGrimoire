const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const stuffCtrl = require('../controllers/book')

router.get('/', stuffCtrl.getAllBook)

router.post('/', auth, multer, stuffCtrl.createBook)

router.get('/:id', stuffCtrl.getOneBook)

router.put('/:id', auth, multer, stuffCtrl.modifyBook)

router.delete('/:id', auth, stuffCtrl.deleteBook)

module.exports = router

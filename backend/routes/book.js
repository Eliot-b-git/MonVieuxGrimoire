const express = require('express')
const router = express.Router()

const stuffCtrl = require('../controllers/book')

// Vos routes

router.post('/', stuffCtrl.createBook)

router.put('/:id', stuffCtrl.modifyBook)

router.delete('/:id', stuffCtrl.deleteBook)

router.get('/:id', stuffCtrl.getOneBook)

router.get('/', stuffCtrl.getAllBook)

module.exports = router

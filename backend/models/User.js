const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

userSchema.plugin(uniqueValidator) //Pour ne pas avoir plusieur compte avec la meme adresse email

module.exports = mongoose.model('User', userSchema)

const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, default: 0 },
})

module.exports = mongoose.model('Book', bookSchema)

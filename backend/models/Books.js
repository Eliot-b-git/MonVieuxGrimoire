const mongoose = require('mongoose')

const bookSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: { type: String, required: true },
        author: { type: String, required: true },
        imageUrl: { type: String, required: true },
        year: { type: Number, required: true },
        genre: { type: String, required: true },
        ratings: [
            {
                userId: { type: String, required: true },
                grade: { type: Number, required: true },
            },
        ],

        averageRating: {
            type: Number,
            default: 0,
            get: function () {
                if (this.ratings.length === 0) return 0

                const sum = this.ratings.reduce(
                    (acc, cur) => acc + cur.grade,
                    0,
                )
                return sum / this.ratings.length
            },
        },
    },
    {
        toJSON: { getters: true },
    },
)

module.exports = mongoose.model('Book', bookSchema)

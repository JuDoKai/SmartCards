const mongoose = require("mongoose");

const flashcardSchema = mongoose.Schema(
    {
        question: { type: String, required: true},
        answer: { type: String, required: true},
        deck: {type: mongoose.Schema.Types.ObjectId, ref: 'Deck'},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Flashcard', flashcardSchema);
const mongoose = require("mongoose");
const flashcardModel = require("./flashcard.model");

const deckSchema = mongoose.Schema(
    {
        title: { type: String, required: true},
        description: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        flashcards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' }],

    },
    {
        timestamps: true
    }
);

deckSchema.pre("remove", async function (next) {
    try {
        await flashcardModel.deleteMany({ deck: this._id });
        console.log(`Toutes les flashcards associées au deck ${this._id} ont été supprimées.`);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Deck', deckSchema);
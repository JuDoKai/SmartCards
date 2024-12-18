const FlashcardModel = require('../models/flashcard.model');
const DeckModel = require('../models/deck.model');
const UserModel = require('../models/user.model');

module.exports.getAllFlashcards = async (req, res) => {
    try {
        const flashcards = await FlashcardModel.find();
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des flashcards.', error: error.message });
    }
};

module.exports.getAllFlashcardsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const flashcards = await FlashcardModel.find({ user: userId });
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des flashcards de l\'utilisateur.', error: error.message });
    }
};

module.exports.getAllFlashcardsByDeckId = async (req, res) => {
    try {
        const { deckId } = req.params;
        const deck = await DeckModel.findById(deckId);
        if (!deck) {
            return res.status(404).json({ message: 'Deck non trouvé.' });
        }

        const flashcards = await FlashcardModel.find({ deck: deckId });
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des flashcards du deck.', error: error.message });
    }
};
module.exports.getFlashcardById = async (req, res) => {
    try {
        const { deckId, id } = req.params;
        const flashcard = await FlashcardModel.findOne({ _id: id, deck: deckId });
        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard non trouvée.' });
        }

        res.status(200).json(flashcard);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la flashcard.', error: error.message });
    }
}
module.exports.createFlashcard = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const { deckId } = req.params;

        // Vérifications des champs requis
        if (!question) {
            return res.status(400).json({ message: "Merci d'ajouter une question." });
        }
        if (!answer) {
            return res.status(400).json({ message: "Merci d'ajouter une réponse." });
        }

        // Vérifier si le deck existe
        const deck = await DeckModel.findById(deckId);
        if (!deck) {
            return res.status(404).json({ message: "Deck non trouvé." });
        }

        // Créer une nouvelle flashcard
        const flashcard = new FlashcardModel({
            question,
            answer,
            deck: deckId, // Référence au deck
        });

        const savedFlashcard = await flashcard.save(); // Sauvegarde de la flashcard

        // Ajouter l'ID de la flashcard au deck
        deck.flashcards.push(savedFlashcard._id);
        await deck.save(); // Sauvegarde du deck

        res.status(201).json({
            message: "Flashcard créée avec succès.",
            flashcard: savedFlashcard,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la création de la flashcard.",
            error: error.message,
        });
    }
};

module.exports.modifyFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; 
        const updatedFlashcard = await FlashcardModel.findByIdAndUpdate(id, updates, {
            new: true, 
            runValidators: true, 
        });

        if (!updatedFlashcard) {
            return res.status(404).json({ message: 'Flashcard non trouvée.' });
        }

        res.status(200).json(updatedFlashcard);
    } catch (error) {
        res.status(400).json({ 
            message: 'Erreur lors de la mise à jour de la flashcard.',
            error: error.message 
        });
    }
};


module.exports.deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFlashcard = await FlashcardModel.findById(id);

    if (!deletedFlashcard) {
        res.status(404).json({message: "Flashcard non trouvé."});
    };

    await deletedFlashcard.deleteOne();
    res.status(200).json("Flashcard supprimé " + req.params.id);

    } catch (error) {
        res.status(500).json({ 
          message: 'Erreur lors de la suppression de la Flashcard.',
          error: error.message 
        });
    };
};
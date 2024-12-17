const FlashcardModel = require('../models/flashcard.model');
const DeckModel = require('../models/deck.model');

module.exports.getFlashcards = async (req, res) => {
    try {
        const flashcards = await FlashcardModel.find();

        if (!flashcards || flashcards.lenght === 0) {
            return res.status(404).json({ message: "Le Deck est vide , aucune flashcard de trouvée."});
        }

        res.status(200).json(flashcards);
    } catch (error) {
        // Gestion des erreurs imprévues
        console.error(error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération des flashcards.", 
            error: error.message 
        });
    }
};


module.exports.getFlashcardById = async (req, res) => {
    try {
        const { id } = req.params;
        const flashcard = await FlashcardModel.findById(id);

        if (!flashcard) {
            return res.status(404).json({ message: "Flashcard non trouvée." });
        }

        res.status(200).json(flashcard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération de la flashcard.", 
            error: error.message 
        });
    }
};

module.exports.createFlashcard = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const { deckId } = req.params;

        if (!question) {
            return res.status(400).json({ message: "Merci d'ajouter une question." });
        }
        if (!answer) {
            return res.status(400).json({ message: "Merci d'ajouter une réponse." });
        }
        if (!deckId) {
            return res.status(400).json({ message: "L'identifiant du deck est requis." });
        }

        const deck = await DeckModel.findById(deckId);
        if (!deck) {
            return res.status(404).json({ message: "Deck non trouvé." });
        }

        const flashcard = await FlashcardModel.create({
            question,
            answer,
            deck: deckId,
        });

        res.status(201).json({
            message: "Flashcard créée avec succès.",
            flashcard,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Erreur lors de la création de la flashcard.",
            error: error.message 
        });
    }
};
module.exports.modifyFlashcard = async (req, res) => {
    try {
        const { deckId } = req.params;
        const updates = req.body; 
        const updatedFlashcard = await FlashcardModel.findByIdAndUpdate(deckId, updates, {
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
    }

    await deletedFlashcard.deleteOne();
    res.status(200).json("Flashcard supprimé " + req.params.id);

    } catch (error) {
        res.status(500).json({ 
          message: 'Erreur lors de la suppression de la Flashcard.',
          error: error.message 
        });
    }
};
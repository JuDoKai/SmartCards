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

const { OpenAI } = require("openai"); 

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports.generateFlashcards = async (req, res) => {
    try {
        const { deckId } = req.params;
        let { number, level } = req.body;

        number = parseInt(number);
        if (!number || number <= 0) {
            return res.status(400).json({ message: "Le nombre de flashcards doit être un entier positif." });
        }

        const levelDescriptions = {
            Primaire: "questions simples et adaptées aux enfants en école primaire.",
            Collège: "questions adaptées aux élèves du collège, avec une difficulté modérée.",
            Lycée: "questions complexes adaptées aux élèves du lycée.",
            Universitaire: "questions approfondies et complexes adaptées aux étudiants universitaires.",
        };

        if (!levelDescriptions[level]) {
            return res.status(400).json({ message: "Niveau scolaire invalide." });
        }

        const deck = await DeckModel.findById(deckId);
        if (!deck) {
            return res.status(404).json({ message: "Deck non trouvé." });
        }

        const prompt = `Génère exactement ${number} flashcards sur ${deck.title} : ${deck.description}.
            Niveau : ${levelDescriptions[level]}.
            Réponse courtes (Max 20 mots).
            Format JSON : [{"question": "?", "answer": "?"}]`;

        // Appel correct à OpenAI
        const aiResponse = await openaiClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
            temperature: 0.4
        });

        const rawText = aiResponse.choices[0]?.message?.content?.trim();
        let generatedFlashcards;

        try {
            generatedFlashcards = JSON.parse(rawText);
            if (!Array.isArray(generatedFlashcards)) {
                throw new Error("Format JSON invalide.");
            }
        } catch (error) {
            return res.status(500).json({ message: "Erreur de format JSON.", rawText });
        }

        const bulkOps = generatedFlashcards.map(flashcard => ({
            insertOne: { document: { question: flashcard.question, answer: flashcard.answer, deck: deckId } }
        }));

        const result = await FlashcardModel.bulkWrite(bulkOps);

        // 🔹 Récupérer les flashcards créées avec leurs questions et réponses
        const createdFlashcards = await FlashcardModel.find({ '_id': { $in: Object.values(result.insertedIds) } });

        res.status(201).json({
            message: "Flashcards générées avec succès.",
            flashcards: createdFlashcards,  // Retourner les flashcards avec leur contenu
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la génération des flashcards.", error: error.message });
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
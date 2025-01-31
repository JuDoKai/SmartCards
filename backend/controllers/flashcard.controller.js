const FlashcardModel = require('../models/flashcard.model');
const DeckModel = require('../models/deck.model');
const UserModel = require('../models/user.model');
const { OpenAI } = require("openai"); 

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


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



const generateFlashcardsInBatches = async (topic, levelDescription, totalNumber, batchSize = 3) => {
    const batchPromises = [];
    for (let i = 0; i < totalNumber; i += batchSize) {
        const prompt = `Génère exactement ${Math.min(batchSize, totalNumber - i)} flashcards sur le sujet : ${topic}.
        Niveau : ${levelDescription}.
        Questions et réponses courtes et précises (moins de 10 mots chacune).
        Réponds uniquement avec un JSON :
        [{"question": "Question ici", "answer": "Réponse ici"}]`;

        batchPromises.push(
            openaiClient.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Tu es un assistant qui génère des flashcards." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.5
            })
        );
    }

    return await Promise.all(batchPromises);
};

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

        const topic = `${deck.title}: ${deck.description}`;
        const aiResponses = await generateFlashcardsInBatches(topic, levelDescriptions[level], number);

        // 🔹 Extraction et parsing des résultats OpenAI
        let generatedFlashcards = [];
        for (const response of aiResponses) {
            try {
                const rawText = response.choices[0]?.message?.content?.trim();
                const parsedFlashcards = JSON.parse(rawText);
                if (Array.isArray(parsedFlashcards)) {
                    generatedFlashcards = [...generatedFlashcards, ...parsedFlashcards];
                }
            } catch (error) {
                console.error("Erreur de parsing JSON:", error);
            }
        }

        if (generatedFlashcards.length === 0) {
            return res.status(500).json({ message: "Erreur de format dans la réponse de l'API." });
        }

        // 🔹 Optimisation MongoDB : insertion en masse avec bulkWrite
        const bulkOps = generatedFlashcards.map(flashcard => ({
            insertOne: {
                document: {
                    question: flashcard.question,
                    answer: flashcard.answer,
                    deck: deckId,
                }
            }
        }));

        const result = await FlashcardModel.bulkWrite(bulkOps);

        // 🔹 Mise à jour du deck avec les nouvelles flashcards
        await DeckModel.updateOne(
            { _id: deckId },
            { $push: { flashcards: { $each: Object.values(result.insertedIds) } } }
        );

        res.status(201).json({
            message: "Flashcards générées et sauvegardées avec succès.",
            flashcards: Object.values(result.insertedIds),
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la génération des flashcards.",
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
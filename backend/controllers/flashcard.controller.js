const FlashcardModel = require('../models/flashcard.model');
const DeckModel = require('../models/deck.model');
const UserModel = require('../models/user.model');
const { OpenAI } = require("openai"); 

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const stringSimilarity = require('string-similarity');


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
        Chaque question doit être **unique** et chaque **réponse doit être différente**. 
        Ne jamais donner la même réponse à des questions différentes.
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

const checkDuplicateFlashcards = async (flashcards) => {
    const existingFlashcards = await FlashcardModel.find({
        $or: flashcards.map(flashcard => ({
            $and: [
                { question: flashcard.question },
                { answer: flashcard.answer }
            ]
        }))
    });

    return existingFlashcards.map(fc => `${fc.question} - ${fc.answer}`);
};

const removeSimilarFlashcards = (flashcards, threshold = 0.8) => {
    const unique = [];

    for (const flashcard of flashcards) {
        const isDuplicate = unique.some(existing =>
            stringSimilarity.compareTwoStrings(existing.question, flashcard.question) > threshold
        );

        if (!isDuplicate) {
            unique.push(flashcard);
        }
    }

    return unique;
};

module.exports.generateFlashcards = async (req, res) => {
    try {
        const { number, level } = req.body;
        const { deckId } = req.params;

        const parsedNumber = parseInt(number);
        if (!parsedNumber || parsedNumber <= 0) {
            return res.status(400).json({ message: "Le nombre de flashcards doit être un entier positif." });
        }

        const levelDescriptions = {
            Primaire: "questions simples et adaptées aux enfants en école primaire.",
            Collège: "questions adaptées aux élèves du collège, avec une difficulté modérée.",
            Lycée: "questions complexes adaptées aux élèves du lycée.",
            Universitaire: "questions approfondies et complexes adaptées aux étudiants universitaires. Pas plus de 10 mots",
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

        generatedFlashcards = removeSimilarFlashcards(generatedFlashcards);

        generatedFlashcards = generatedFlashcards.slice(0, number);


        if (generatedFlashcards.length === 0) {
            return res.status(500).json({ message: "Erreur de format dans la réponse de l'API." });
        }

        // Vérifier les doublons avant l'insertion
        const duplicateFlashcards = await checkDuplicateFlashcards(generatedFlashcards);
        if (duplicateFlashcards.length > 0) {
            return res.status(400).json({
                message: "Certaines flashcards sont déjà présentes dans la base de données.",
                duplicates: duplicateFlashcards
            });
        }

        // Insertion en masse des flashcards uniques
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

        // Mise à jour du deck avec les nouvelles flashcards
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
        console.log("Tentative de suppression de la flashcard avec l'ID :", id);

        // 1. Supprimer la flashcard dans la collection flashcards
        const flashcard = await FlashcardModel.findById(id);
        
        if (!flashcard) {
            console.log("Flashcard non trouvée !");
            return res.status(404).json({ message: "Flashcard non trouvée." });
        }

        // 2. Supprimer l'ID de la flashcard des decks qui la contiennent
        await DeckModel.updateMany(
            { flashcards: id },  // Trouver les decks contenant l'ID de cette flashcard
            { $pull: { flashcards: id } }  // Retirer l'ID de la flashcard du tableau flashcards
        );
        console.log("Références à la flashcard supprimées des decks.");

        // 3. Supprimer la flashcard de la collection flashcards
        await FlashcardModel.findByIdAndDelete(id);
        console.log("Flashcard supprimée avec succès :", id);

        res.status(200).json({ message: "Flashcard supprimée", id });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error.message);
        res.status(500).json({
            message: "Erreur lors de la suppression de la Flashcard.",
            error: error.message
        });
    }
};



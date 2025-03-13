const Deck = require("../models/deck.model");
const User = require("../models/user.model");
const Flashcard = require("../models/flashcard.model");
const { OpenAI } = require("openai");

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ✅ Récupère tous les decks avec les utilisateurs et flashcards associées.
 */
module.exports.getAllDecks = async (req, res) => {
    try {
        const decks = await Deck.find()
            .populate("user", "username")
            .populate("flashcards")
            .exec();
        res.status(200).json(decks);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des decks.",
            error: error.message,
        });
    }
};

/**
 * ✅ Récupère les decks par userId ou deckId.
 */
module.exports.getAllDecksByUserIdOrDeckId = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID correspond à un utilisateur
        const user = await User.findById(id);
        if (user) {
            const decks = await Deck.find({ user: id }).populate("user", "username").exec();
            return res.status(decks.length ? 200 : 404).json(decks.length ? decks : { message: "Aucun deck trouvé pour cet utilisateur." });
        }

        // Vérifier si l'ID correspond à un deck
        const deck = await Deck.findById(id).populate("user", "username").exec();
        return deck ? res.status(200).json(deck) : res.status(404).json({ message: "Aucun utilisateur ou deck trouvé avec cet ID." });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des decks.",
            error: error.message,
        });
    }
};

/**
 * ✅ Génère des flashcards par batchs en demandant à OpenAI.
 */
const generateFlashcardsInBatches = async (topic, levelDescription, totalNumber, batchSize = 3) => {
    const batchPromises = [];
    for (let i = 0; i < totalNumber; i += batchSize) {
        const prompt = `Génère exactement ${Math.min(batchSize, totalNumber - i)} flashcards sur le sujet : ${topic}.
        Niveau : ${levelDescription}.
        Format JSON strict : [{"question": "Question ici", "answer": "Réponse ici"}].`;

        batchPromises.push(
            openaiClient.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "Tu es un assistant qui génère des flashcards." }, { role: "user", content: prompt }],
                max_tokens: 200,
                temperature: 0.5,
            })
        );
    }
    return await Promise.all(batchPromises);
};

/**
 * ✅ Vérifie l'existence de flashcards dupliquées.
 */
const checkDuplicateFlashcards = async (flashcards) => {
    const existingFlashcards = await Flashcard.find({
        $or: flashcards.map((flashcard) => ({
            question: flashcard.question,
            answer: flashcard.answer,
        })),
    });

    return existingFlashcards.map((fc) => `${fc.question} - ${fc.answer}`);
};

/**
 * ✅ Crée un deck et génère des flashcards avec OpenAI.
 */
module.exports.createDeck = async (req, res) => {
    try {
        const { title, description, number, level } = req.body;
        const { userId } = req.params;

        if (!title) return res.status(400).json({ message: "Le titre est requis." });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

        const newDeck = new Deck({ title, description, user: userId });
        const savedDeck = await newDeck.save();

        await User.findByIdAndUpdate(userId, { $push: { decks: savedDeck._id } });

        if (!number || number <= 0) return res.status(200).json(savedDeck);

        const levelDescriptions = {
            Primaire: "questions simples adaptées aux enfants en école primaire.",
            Collège: "questions adaptées aux élèves du collège.",
            Lycée: "questions complexes adaptées aux lycéens.",
            Universitaire: "questions approfondies pour les étudiants universitaires.",
        };

        if (!levelDescriptions[level]) return res.status(400).json({ message: "Niveau scolaire invalide." });

        const topic = `${title}: ${description}`;
        const aiResponses = await generateFlashcardsInBatches(topic, levelDescriptions[level], number);

        let generatedFlashcards = [];
        for (const response of aiResponses) {
            try {
                const rawText = response.choices[0]?.message?.content?.trim().replace(/```json|```/g, "").trim();
                const parsedFlashcards = JSON.parse(rawText);
                if (Array.isArray(parsedFlashcards)) generatedFlashcards.push(...parsedFlashcards);
            } catch (error) {
                console.error("❌ Erreur de parsing JSON:", error);
            }
        }

        if (generatedFlashcards.length === 0) return res.status(500).json({ message: "Erreur de format dans la réponse de l'API." });

        const duplicateFlashcards = await checkDuplicateFlashcards(generatedFlashcards);
        if (duplicateFlashcards.length > 0) return res.status(400).json({ message: "Flashcards en doublon.", duplicates: duplicateFlashcards });

        const flashcardsToInsert = generatedFlashcards.map((flashcard) => ({
            question: flashcard.question,
            answer: flashcard.answer,
            deck: savedDeck._id,
        }));

        const insertedFlashcards = await Flashcard.insertMany(flashcardsToInsert);
        await Deck.findByIdAndUpdate(savedDeck._id, { $push: { flashcards: { $each: insertedFlashcards.map((fc) => fc._id) } } });

        res.status(201).json({ message: "Deck créé et flashcards générées.", deck: savedDeck, flashcards: insertedFlashcards });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du deck.", error: error.message });
    }
};

/**
 * ✅ Met à jour un deck existant.
 */
module.exports.updateDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDeck = await Deck.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        updatedDeck ? res.status(200).json(updatedDeck) : res.status(404).json({ message: "Deck non trouvé." });

    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour du deck.", error: error.message });
    }
};

/**
 * ✅ Supprime un deck et ses flashcards associées.
 */
module.exports.deleteDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDeck = await Deck.findById(id);

        if (!deletedDeck) return res.status(404).json({ message: "Deck non trouvé." });

        await Flashcard.deleteMany({ deck: id });
        await deletedDeck.deleteOne();

        res.status(200).json({ message: "Deck et flashcards supprimés avec succès." });

    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la suppression.", error: error.message });
    }
};

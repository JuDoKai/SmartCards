const Deck = require('../models/deck.model');
const User = require('../models/user.model');
const Flashcard = require('../models/flashcard.model');

const { OpenAI } = require("openai"); 

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


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

module.exports.getAllDecks = async (req, res) => {
    try {
      const decks = await Deck.find()
            .populate('user', 'username')
            .populate('flashcards')
            .exec();
      res.status(200).json(decks);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des decks.', error: error.message });
    }
  };


// La fonction suivante test si l'id est un id d'un utilisateur ou d'un deck. 
// Cela nous permet de simplifier la gestion des endpoints du deck.routes

module.exports.getAllDecksByUserIdOrDeckId = async (req, res) => {
  try {

    // Cas 1) l'id est un UserId
    const { id } = req.params;

    const user = await User.findById(id);
    if (user) {
      const decks = await Deck.find({ user: id })
            .populate('user', 'username')
            .exec();
      if (decks.length === 0) {
        return res.status(404).json({ message: "Aucun deck trouvé pour cet utilisateur." });
      }
      return res.status(200).json(decks);
    }

    // Cas 2) l'id est un DeckId

    const deck = await Deck.findById(id)
          .populate('user', 'username')
          .exec();
    if (deck) {
      return res.status(200).json(deck);
    }

    return res.status(404).json({ message: "Aucun utilisateur ou deck trouvé avec cet ID." });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des decks.",
      error: error.message,
    });
  }
};


module.exports.createDeck = async (req, res) => {
  try {
      const { title, description, number, level } = req.body;
      const { userId } = req.params;

      if (!title) {
          return res.status(400).json({ message: "Le titre est requis." });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      const newDeck = new Deck({
          title,
          description,
          user: userId,
      });

      const savedDeck = await newDeck.save();

      await User.findByIdAndUpdate(userId, {
          $push: { decks: savedDeck._id },
      });

      if (!number || number <= 0) {
          return res.status(200).json(savedDeck);
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

      // Génération des flashcards avec OpenAI
      const topic = `${title}: ${description}`;
      const aiResponses = await generateFlashcardsInBatches(topic, levelDescriptions[level], number);

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

      // Sauvegarde des flashcards dans MongoDB
      const flashcardsToInsert = generatedFlashcards.map(flashcard => ({
          question: flashcard.question,
          answer: flashcard.answer,
          deck: savedDeck._id,
      }));

      const insertedFlashcards = await Flashcard.insertMany(flashcardsToInsert);

      // Mise à jour du deck avec les flashcards**
      await Deck.findByIdAndUpdate(savedDeck._id, {
          $push: { flashcards: { $each: insertedFlashcards.map(fc => fc._id) } }
      });

      // Retour de la réponse finale avec les flashcards**
      res.status(201).json({
          message: "Deck créé avec succès et flashcards générées.",
          deck: savedDeck,
          flashcards: insertedFlashcards,
      });

  } catch (error) {
      res.status(500).json({
          message: 'Erreur lors de la création du deck et de la génération des flashcards.',
          error: error.message
      });
  }
};





module.exports.updateDeck = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const updatedDeck = await Deck.findByIdAndUpdate(id, updates, 
        { new: true ,
          runValidators: true 
        });
  
      if (!updatedDeck) {
        return res.status(404).json({ message: 'Deck non trouvé.' });
      }
  
      res.status(200).json(updatedDeck);
    } catch (error) {
      res.status(400).json({ 
        message: 'Erreur lors de la mise à jour du deck.', 
        error: error.message 
      });
    }
  };
  
module.exports.deleteDeck = async (req, res) => {
  try {
      const { id } = req.params;

      // Trouver le deck à supprimer
      const deletedDeck = await Deck.findById(id);
      if (!deletedDeck) {
          return res.status(404).json({ message: 'Deck non trouvé.' });
      }

      // Supprimer toutes les flashcards associées au deck
      await Flashcard.deleteMany({ deck: id });

      // Supprimer le deck
      await deletedDeck.deleteOne();

      res.status(200).json({ message: 'Deck et ses flashcards supprimés avec succès.' });
  } catch (error) {
      res.status(400).json({
          message: 'Erreur lors de la suppression du deck.',
          error: error.message,
      });
  }
};

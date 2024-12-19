const Deck = require('../models/deck.model');
const User = require('../models/user.model');

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
        const { title, description } = req.body;
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

        res.status(200).json(savedDeck);   
    } catch (error) {
        res.status(500).json({ 
          message: 'Erreur lors de la création du deck.', 
          error: error.message 
        });
    }
}


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
      const deletedDeck = await Deck.findById(id);
  
      if (!deletedDeck) {
        return res.status(404).json({ message: 'Deck non trouvé.' });
      }

      await deletedDeck.deleteOne();
      res.status(200).json({ message: 'Deck supprimé avec succès.' });
    } catch (error) {
      res.status(400).json({ 
        message: 'Erreur lors de la suppression du deck.',
        error: error.message 
      });
    }
  };
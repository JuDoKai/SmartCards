const express = require('express');
const { getFlashcardById, createFlashcard, modifyFlashcard, deleteFlashcard, getAllFlashcards, getAllFlashcardsByUserId, getAllFlashcardsByDeckId , generateFlashcards} = require('../controllers/flashcard.controller');
const router = express.Router();

 // Renvoie tout les flashcards de tout les utilisateurs
router.get("/", getAllFlashcards);

// Renvoie tout les flashcards de l'utilisateur
router.get("/:userId", getAllFlashcardsByUserId);

// Renvoie tout les flashcards du deck
router.get("/decks/:deckId", getAllFlashcardsByDeckId);

// Renvoie la flashcard à partir de son id
router.get("/:deckId/:id", getFlashcardById);

router.post("/:deckId", createFlashcard);
router.post("/:deckId/generate", generateFlashcards);
router.patch("/:id", modifyFlashcard); 
router.delete("/:id", deleteFlashcard);

module.exports = router;
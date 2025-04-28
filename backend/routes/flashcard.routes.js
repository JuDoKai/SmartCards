const express = require('express');
const { getFlashcardById, createFlashcard, modifyFlashcard, deleteFlashcard, getAllFlashcards, getAllFlashcardsByUserId, getAllFlashcardsByDeckId , generateFlashcards} = require('../controllers/flashcard.controller');
const router = express.Router();


router.get("/", getAllFlashcards);
router.get("/:userId", getAllFlashcardsByUserId);
router.get("/decks/:deckId", getAllFlashcardsByDeckId);
router.get("/:deckId/:id", getFlashcardById);
router.post("/:deckId", createFlashcard);
router.post("/:deckId/generate", generateFlashcards);
router.patch("/:id", modifyFlashcard); 
router.delete("/:id", deleteFlashcard);

module.exports = router;
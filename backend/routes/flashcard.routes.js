const express = require('express');
const { getFlashcards, getFlashcardById, setFlashcards, createFlashcard, modifyFlashcard, deleteFlashcard } = require('../controllers/flashcard.controller');
const router = express.Router();

router.get("/", getAllFlashcards);
router.get("/:deckId", getAllFlashcards)
router.get("/:deckId/:id", getFlashcardById);
router.post("/", createFlashcard);
router.patch("/:id", modifyFlashcard); // S'applique lors de chaque modification de la Flashcard
router.delete("/:id", deleteFlashcard);

module.exports = router;
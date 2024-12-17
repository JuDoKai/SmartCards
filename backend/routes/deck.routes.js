const express = require('express');
const { getAllDecks, createDeck, updateDeck, deleteDeck, getAllDecksByUserIdOrDeckId } = require('../controllers/deck.controller');

const router = express.Router();

router.get("/", getAllDecks);
router.get("/:id", getAllDecksByUserIdOrDeckId);
router.post("/", createDeck);
router.patch("/:id", updateDeck);
router.delete("/:id", deleteDeck);

module.exports = router;

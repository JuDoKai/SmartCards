const express = require('express');
const { getAllDecks, createDeck, updateDeck, deleteDeck, getAllDecksByUserIdOrDeckId, deleteAllDecksByUser  } = require('../controllers/deck.controller');

const router = express.Router();

router.get("/", getAllDecks);
router.get("/:id", getAllDecksByUserIdOrDeckId);
router.post("/:userId", createDeck);
router.patch("/:id", updateDeck);
router.delete("/:id", deleteDeck);
router.delete('/user/:userId', deleteAllDecksByUser);


module.exports = router;

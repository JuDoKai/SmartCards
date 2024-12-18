const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
const dotenv = require("dotenv").config();
const port = 5000;

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const deckRoutes = require('./routes/deck.routes');
const flashcardRoutes = require('./routes/flashcard.routes');

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());


// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/flashcards', flashcardRoutes);
app.use('/decks', deckRoutes);


app.listen(port, () => {
    console.log(`Notre application Node est démarrée sur : http://localhost:${port}`);
});

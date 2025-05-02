const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
require("dotenv").config();

const port = process.env.PORT || 4000;

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const deckRoutes = require('./routes/deck.routes');
const flashcardRoutes = require('./routes/flashcard.routes');

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: 'https://smartcards-frontend.onrender.com',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/flashcards', flashcardRoutes);
app.use('/decks', deckRoutes);


app.listen(port, 
    () => console.log(`Server running on port ${port}`));

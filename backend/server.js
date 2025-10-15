const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
require("dotenv").config();

const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

console.log("CORS allowed origin:", process.env.CLIENT_URL);

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Routes API
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/flashcards', require('./routes/flashcard.routes'));
app.use('/decks', require('./routes/deck.routes'));

app.listen(port, () => console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`));

const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const corsOptions = {
  origin: 'https://smartcards-frontend.onrender.com',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/flashcards', require('./routes/flashcard.routes'));
app.use('/decks', require('./routes/deck.routes'));

app.listen(port, () => console.log(`Server running on port ${port}`));

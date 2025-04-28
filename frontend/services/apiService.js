import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// ✅ Endpoint Users

export const getAllUsers = async () => {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}/users`, userData);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await axios.patch(`${BASE_URL}/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${BASE_URL}/users/${userId}`);
    return response.data;
};

// ✅ Endpoint Decks

export const getAllDecks = async () => {
    const response = await axios.get(`${BASE_URL}/decks`);
    return response.data;
};

export const getDecksByUserId = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/decks/${userId}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        throw error;
    }
};

export const getDeckByDeckId = async (deckId) => {
    const response = await axios.get(`${BASE_URL}/decks/${deckId}`);
    return response.data;
};

export const createDeck = async (userId, deckData) => {
    const response = await axios.post(`${BASE_URL}/decks/${userId}`, deckData);
    return response.data;
};

export const updateDeck = async (deckId, deckData) => {
    const response = await axios.patch(`${BASE_URL}/decks/${deckId}`, deckData);
    return response.data;
};

export const deleteDeck = async (deckId) => {
    const response = await axios.delete(`${BASE_URL}/decks/${deckId}`);
    return response.data;
};

export const deleteAllDeckByUser = async (userId) => {
    const response = await axios.delete(`${BASE_URL}/decks/user/${userId}`);
    return response.data;
};

// ✅ Endpoint Flashcards

export const getAllFlashcards = async () => {
    const response = await axios.get(`${BASE_URL}/flashcards`);
    return response.data;
};

export const getAllFlashcardsByUserId = async (userId) => {
    const response = await axios.get(`${BASE_URL}/flashcards/${userId}`);
    return response.data;
};

export const getAllFlashcardsByDeckId = async (deckId) => {
    const response = await axios.get(`${BASE_URL}/flashcards/decks/${deckId}`);
    return response.data;
};

export const getFlashcardById = async (deckId, flashcardId) => {
    const response = await axios.get(`${BASE_URL}/flashcards/${deckId}/${flashcardId}`);
    return response.data;
};

export const createFlashcard = async (deckId, flashcardsData) => {
    const response = await axios.post(`${BASE_URL}/flashcards/${deckId}`, flashcardsData);
    return response.data;
};

export const generateFlashcard = async (deckId, flashcardsData) => {
    try {
        const response = await axios.post(`${BASE_URL}/flashcards/${deckId}/generate`, flashcardsData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la génération des flashcards:', error);
        throw error;
    }
};

export const modifyFlashcard = async (flashcardId, flashcardData) => {
    const response = await axios.patch(`${BASE_URL}/flashcards/${flashcardId}`, flashcardData);
    return response.data;
};

export const deleteFlashcard = async (flashcardId) => {
    const response = await axios.delete(`${BASE_URL}/flashcards/${flashcardId}`);
    return response.data;
};

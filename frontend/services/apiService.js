import axios from 'axios';

const BASE_URL = 'http://localhost:5000';


// Endpoint Users

export const getAllUsers = async() => {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data; 
};
export const getUserById = async(userId) => {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data; 
};

export const createUser = async(userId) => {
    const response = await axios.post(`${BASE_URL}/users`);
    return response.data; 
};
export const updateUser = async(userId) => {
    const response = await axios.patch(`${BASE_URL}/users/${userId}`);
    return response.data; 
};
export const deleteUser = async(userId) => {
    const response = await axios.delete(`${BASE_URL}/users/${userId}`);
    return response.data; 
};

// Endpoint Decks

export const getAllDecks = async() => {
    const response = await axios.get(`${BASE_URL}/decks`);
    return response.data; 
}

export const getDecksByUserId = async(userId) => {
    const response = await axios.get(`${BASE_URL}/decks/${userId}`);
    return response.data; 
}
export const createDeck = async(userId, deckData) => {
    const response = await axios.post(`${BASE_URL}/decks/${userId}`, deckData);
    return response.data; 
}
export const updateDeck = async(deckId, deckData) => {
    const response = await axios.patch(`${BASE_URL}/decks/${deckId}`, deckData);
    return response.data; 
}
export const deleteDeck = async(deckId) => {
    const response = await axios.delete(`${BASE_URL}/decks/${deckId}`);
    return response.data; 
}

// Endpoint Flashcards

export const getAllFlashcards = async() => {
    const reponse = await axios.get(`${BASE_URL}/flashcards`);
    return reponse.data;
}

export const getAllFlashcardsByUserId = async() => {
    const reponse = await axios.get(`${BASE_URL}/flashcards/${userId}`);
    return reponse.data;
}

export const getAllFlashcardsByDeckId = async() => {
    const reponse = await axios.get(`${BASE_URL}/flashcards/decks/${deckId}`);
    return reponse.data;
}

export const getFlashcardById = async() => {
    const reponse = await axios.get(`${BASE_URL}/flashcards/${deckId}/${flashcardId}`);
    return reponse.data;
}

export const createFlashcard = async() => {
    const reponse = await axios.post(`${BASE_URL}/flashcards/${deckId}`);
    return reponse.data;
}

export const modifyFlashcard = async() => {
    const reponse = await axios.patch(`${BASE_URL}/flashcards/${flashcardId}`);
    return reponse.data;
}

export const deleteFlashcard = async() => {
    const reponse = await axios.delete(`${BASE_URL}/flashcards/${flashcardId}`);
    return reponse.data;
}


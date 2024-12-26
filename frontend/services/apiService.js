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
export const createDeck = async(userId) => {
    const response = await axios.post(`${BASE_URL}/decks/${userId}`);
    return response.data; 
}
export const updateDeck = async(deckId) => {
    const response = await axios.patch(`${BASE_URL}/decks/${deckId}`);
    return response.data; 
}
export const deleteDeck = async(deckId) => {
    const response = await axios.delete(`${BASE_URL}/decks/${deckId}`);
    return response.data; 
}

// Endpoint Flashcards


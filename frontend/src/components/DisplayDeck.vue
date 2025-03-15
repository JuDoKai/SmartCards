<template>
    <h1>Vos Decks</h1>
    <div class="container" v-if="user.decks.length == 0">
      <span class="empty-list">La liste de deck est vide...</span>
    </div>

    <div class="filter">
      <form @submit.prevent="filterDeck">
        <label for="filter">Filtre : </label>
        <select v-model="filterMode" name="filter" @change="filterDeck">
          <option value="default">Défaut</option>
          <option value="alphabetical">Alphabétique</option>
          <option value="chnonological">Chronologique</option>
          <option value="ascending">Croissant</option>
          <option value="descending">Décroissant</option>
        </select>
      </form>
    </div>

    <div class="deck-container">
      <div class="deck-item" v-for="(deck, index) in filteredDecks" :key="deck._id">
        <div class="deck-title"><strong>{{ deck.title }}</strong><br /></div>
        <div class="deck-description"><i>{{ deck.description }}</i></div>
        <div class="deck-capacity">
          <p v-if="deck.flashcards.length == 0">Deck vide</p>
          <p v-else-if="deck.flashcards.length == 1">1 carte</p>
          <p v-else>{{ deck.flashcards.length}} cartes</p>
        </div>
        <div class="options">
          <div @click="showCards(deck._id)">
            <div class="eye">
              <img
                src="@/assets/icons/eye.svg"
                title="Afficher les cartes du deck"
                alt="Afficher les cartes du deck"
              />
            </div>
          </div>
          <div @click="openModifyDeckModal(index)" class="pen">
            <img
              src="@/assets/icons/pen.svg"
              title="Modifier le deck"
              alt="Modifier le Deck"
            />
          </div>
          <div @click="openDeleteDeckModal(index)" class="trash">
            <img
              src="@/assets/icons/trash.svg"
              title="Supprimer le deck"
              alt="Supprimer le Deck"
            />
          </div>
         
        </div>
      </div>
    </div>

    <div v-if="isModalOpenPen" class="overlay">
      <div class="modal">
        <strong><p>Modifier Deck</p></strong>

        <form @submit.prevent="newDeck">
          <div class="form-slot">
            <label for="title">Titre du Deck </label>
            <input type="text" v-model.trim="deckTitle" required />
          </div>
          <div class="form-slot">
            <label for="description">Description (recommandé) </label>
            <input type="text" v-model.trim="deckDescription" />
          </div>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <div class="buttons">
            <button type="submit" :disabled="deckTitle.trim().length === 0" @click="confirmModifyDeck">Valider</button>
            <button type="button" @click="closeModal">Annuler</button>
          </div>
          </form>
      </div>
    </div>
  
    <div v-if="isModalOpenTrash" class="overlay">
      <div class="modal">
        <strong><p>Supprimer Deck</p></strong>

        <p>Voulez-vous supprimer définitivement le deck <strong>{{ deckTitle }}</strong> ?</p>
        <div class="buttons">
          <button type="button" @click="confirmDeleteDeck">Valider</button>
          <button type="button" @click="closeModal">Annuler</button>
        </div>
       
      </div>
    </div>

    
</template>
  
<script setup>

import { ref, computed } from "vue";
import router from "@/router";
import { deleteDeck, updateDeck } from "../../services/apiService";

const isModalOpenTrash = ref(false);
const isModalOpenPen = ref(false);
const selectedDeckIndex = ref(null);
const deckTitle = ref("");
const deckDescription = ref("");
const filterMode = ref("default");
const errorMessage = ref("");


const user = defineProps({
  decks: Array,
});


const openDeleteDeckModal = (index) => {
  selectedDeckIndex.value = index;
  deckTitle.value = user.decks[index].title;
  isModalOpenTrash.value = true;
};

const closeModal = () => {
  isModalOpenTrash.value = false;
  isModalOpenPen.value = false;

  selectedDeckIndex.value = null;
  deckTitle.value = "";
  deckDescription.value = "";
  errorMessage.value = ""; 
};


const openModifyDeckModal = (index) => {
  selectedDeckIndex.value = index;
  deckTitle.value = user.decks[index].title;
  deckDescription.value = user.decks[index].description;
  isModalOpenPen.value = true;
}

const confirmDeleteDeck = async () => {
  const deckId = user.decks[selectedDeckIndex.value]._id;
  try {
    await deleteDeck(deckId);
    user.decks.splice(selectedDeckIndex.value, 1);
    closeModal();
    console.log("Deck supprimé :", deckId);
  } catch (error) {
    console.error("Erreur lors de la suppression du deck :", error);
  }
};

const confirmModifyDeck = async () => {
  const deckId = user.decks[selectedDeckIndex.value]._id;
  const deckData = {
    title: deckTitle.value.trim(), 
    description: deckDescription.value.trim(),
  };

  try {
    await updateDeck(deckId, deckData);
    user.decks[selectedDeckIndex.value].title = deckData.title; 
    user.decks[selectedDeckIndex.value].description = deckData.description;
    closeModal(); 
  } catch (error) {
    console.error("Erreur lors de la modification du deck :", error);
    errorMessage.value = "Une erreur est survenue lors de la modification.";
  }
};


const showCards = (id) => {
    router.push(`/dashboard/${id}`);
}

const filteredDecks = computed(() => {
  if (filterMode.value === "alphabetical") {
    return [...user.decks].sort((a, b) => a.title.localeCompare(b.title));
  } else if (filterMode.value === "chnonological") {
    return [...user.decks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (filterMode.value === "ascending") {
    return [...user.decks].sort((a, b) => a.flashcards.length - b.flashcards.length);
  } else if (filterMode.value === "descending") {
    return [...user.decks].sort((a, b) => b.flashcards.length - a.flashcards.length);
  } 
  return user.decks;

});

</script>


<style scoped>

h1 {
  margin-left: 1rem;
  font-size: clamp(1.25rem, 7vw, 2rem);
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;
}


.empty-list {
  display: flex;
  justify-content: center;
  font-size: clamp(1rem, 5vw, 3rem);
  opacity: 0.5;
}

.deck-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
  max-width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
}

.deck-container p {
  font-size: clamp(0.75rem, 4vw, 1.4rem);
 
}

.deck-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 1rem;
    border: 4px solid black;
    border-radius: 8px;
    background-color: rgb(255, 244, 224);
    font-size: 1.4rem;
}
 
.deck-capacity p{
    margin: 0;
}

.options {
    display: flex;
    gap: 3rem;
    margin-top: 1rem;
}

.options img {
  height: 30px;
  width: 30px;
}

.eye,
.trash,
.pen {
    cursor: pointer;
}

.form-slot {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    margin-bottom: 10px;
}

.form-slot input {
    align-self: center;
    width: 100%;
    padding: 0.5rem 0 0.5rem 0.5rem;
    border-radius: 0.5rem;
    border: 2px solid #d9d9d9;
}

.form-slot input:focus {
    outline: 2px solid;
}



.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

button {
    color: #fefcfb;
    background-color: #cf7600;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-weight: 700;
    border: none;
}

button:hover {
    background-color: #b96500;
}



</style>
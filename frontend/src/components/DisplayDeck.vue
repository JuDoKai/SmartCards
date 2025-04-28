<template>
  <h1>Vos Decks</h1>

  <div class="organization">
    <div class="sort">
      <form @submit.prevent>
        <label for="sort">Tri : </label>
        <select id="sort" v-model="sortMode" name="sort" @change="sortDeck">
          <option value="default">Défaut</option>
          <option value="alphabetical">Alphabétique</option>
          <option value="chronological">Chronologique</option>
          <option value="ascending">Croissant</option>
          <option value="descending">Décroissant</option>
        </select>
      </form>
    </div>

    <div class="display">
      <form @submit.prevent>
        <label for="display">Affichage : </label>
        <select id="display" v-model="displayMode" name="display">
          <option value="simple">Simple</option>
          <option value="list">Liste</option>
        </select>
      </form>
    </div>
  </div>

  <div class="container" v-if="props.decks.length === 0">
    <span class="empty-list">La liste de decks est vide...</span>
  </div>

  <Pagination 
    v-if="sortedDecks.length > 0"
    :decks="sortedDecks" 
    :currentPage="currentPage" 
    @pageChanged="changePage" 
  />

  <div class="decks-container">
    <div :class="displayMode === 'simple' ? 'deck-container-simple' : 'deck-container-list'">
      <div v-for="deck in paginatedDecks" :key="deck._id">
        <Deck
          :display="displayMode"
          :deckTitle="deck.title"
          :deckDescription="deck.description"
          :deckLength="deck.flashcards.length"
          @showCards="showCards(deck._id)"
          @modifyDeck="openModifyDeckModal(deck)"
          @deleteDeck="openDeleteDeckModal(deck)"
        />
      </div>
    </div>

    <button class="delete-all" v-if="paginatedDecks.length > 0" @click="isModalOpenDeleteAll = true">
      Tout Supprimer
    </button>
  </div>

  <!-- Modals (modify / delete / delete all) -->
  <div v-if="isModalOpenPen" class="overlay">
    <div class="modal">
      <h3>Modifier Deck</h3>
      <form @submit.prevent="confirmModifyDeck">
        <div class="form-slot">
          <label for="title">Titre :</label>
          <input type="text" v-model="deckTitle" required />
        </div>
        <div class="form-slot">
          <label for="description">Description :</label>
          <input type="text" v-model="deckDescription" />
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <div class="buttons">
          <button type="submit">Valider</button>
          <button type="button" @click="closeModal">Annuler</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="isModalOpenTrash" class="overlay">
    <div class="modal">
      <h3>Supprimer Deck</h3>
      <p>Voulez-vous vraiment supprimer <strong>{{ deckTitle }}</strong> ?</p>

      <div class="buttons">
        <button type="button" @click="confirmDeleteDeck">Supprimer</button>
        <button type="button" @click="closeModal">Annuler</button>
      </div>
    </div>
  </div>

  <div v-if="isModalOpenDeleteAll" class="overlay">
    <div class="modal">
      <h3>Supprimer tous les decks</h3>
      <p>Êtes-vous sûr de vouloir supprimer <strong>tous vos decks</strong> ? Cette action est irréversible.</p>

      <div class="buttons">
        <button type="button" @click="confirmDeleteAllDecks">Supprimer tout</button>
        <button type="button" @click="isModalOpenDeleteAll = false">Annuler</button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, defineEmits } from "vue";
import router from "@/router";
import { deleteDeck, deleteAllDeckByUser, updateDeck } from '../../services/apiService';
import Deck from "./Deck.vue";
import Pagination from "./Pagination.vue";

const props = defineProps({
  decks: Array,
  userId: String
});

const emit = defineEmits(["deckUpdated", "deckDeleted", "allDecksDeleted"]);

const deckTitle = ref("");
const deckDescription = ref("");
const sortMode = ref("default");
const displayMode = ref("simple");
const selectedDeckId = ref(null);
const currentPage = ref(1);
const decksPerPage = 10;
const isModalOpenPen = ref(false);
const isModalOpenTrash = ref(false);
const isModalOpenDeleteAll = ref(false);

const errorMessage = ref("");

// Tri
const sortedDecks = computed(() => {
  let sorted = [...props.decks];
  if (sortMode.value === "alphabetical") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMode.value === "chronological") {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortMode.value === "ascending") {
    sorted.sort((a, b) => a.flashcards.length - b.flashcards.length);
  } else if (sortMode.value === "descending") {
    sorted.sort((a, b) => b.flashcards.length - a.flashcards.length);
  }
  return sorted;
});

// Pagination
const paginatedDecks = computed(() => {
  const start = (currentPage.value - 1) * decksPerPage;
  return sortedDecks.value.slice(start, start + decksPerPage);
});

const changePage = (newPage) => {
  currentPage.value = newPage;
};

const sortDeck = () => {
  currentPage.value = 1;
};

// Navigation
const showCards = (id) => {
  if (!id) {
    console.error("ID du deck non défini !");
    return;
  }
  router.push(`/dashboard/${id}`);
};
// Modification
const openModifyDeckModal = (deck) => {
  selectedDeckId.value = deck._id;
  deckTitle.value = deck.title;
  deckDescription.value = deck.description || "";
  isModalOpenPen.value = true;
};

const confirmModifyDeck = async () => {
  const deckId = selectedDeckId.value;
  const deckData = {
    title: deckTitle.value.trim(),
    description: deckDescription.value.trim(),
  };

  try {
    const updatedDeck = await updateDeck(deckId, deckData);
    emit("deckUpdated", updatedDeck); 
    closeModal();
  } catch (error) {
    console.error("Erreur lors de la modification du deck :", error);
    errorMessage.value = "Une erreur est survenue lors de la modification.";
  }
};

// Suppression
const openDeleteDeckModal = (deck) => {
  selectedDeckId.value = deck._id;
  deckTitle.value = deck.title;
  isModalOpenTrash.value = true;
};

const confirmDeleteDeck = async () => {
  try {
    await deleteDeck(selectedDeckId.value);
    emit("deckDeleted", selectedDeckId.value);
    currentPage.value = 1;
    closeModal();
  } catch (error) {
    console.error("Erreur lors de la suppression du deck :", error);
  }
};

const confirmDeleteAllDecks = async () => {
  try {
    await deleteAllDeckByUser(props.userId);
    emit("allDecksDeleted", []); 
    isModalOpenDeleteAll.value = false;
    currentPage.value = 1;
  } catch (error) {
    console.error("Erreur lors de la suppression de tous les decks :", error);
  }
};


// Reset des modals
const closeModal = () => {
  isModalOpenPen.value = false;
  isModalOpenTrash.value = false;
  isModalOpenDeleteAll.value = false;
  selectedDeckId.value = null;
  deckTitle.value = "";
  deckDescription.value = "";
  errorMessage.value = "";
};
</script>

<style scoped>

h1 {
  margin-left: 1rem;
  font-size: clamp(1.25rem, 7vw, 2rem);
}

.organization {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: flex-end;
  margin-right: 30px;
  margin-bottom: 15px;
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

.decks-container {
  position: relative;
}

.decks-container .deck-container-list {
  display: flex;
  flex-direction: column;
}

.deck-container p {
  font-size: clamp(0.75rem, 4vw, 1.4rem);
}

.deck-capacity p{
    margin: 0;
}

.deck-container-simple {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Ajuste la taille des éléments avec minmax */
  gap: 20px;
  padding: 1rem;
  box-sizing: border-box;
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

.buttons button:hover {
    background-color: #b96500;
}

.delete-all {
  background-color: rgb(180, 21, 21);
  border: 5px solid black;
  margin-top: 3rem ;


  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%,-70%);
}



</style>
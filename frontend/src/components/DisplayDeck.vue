<template>
  <h1>Vos Decks</h1>

  <div class="container" v-if="decks.length == 0">
    <span class="empty-list">La liste de decks est vide...</span>
  </div>

  <div class="organization">
    <div class="sort">
      <form @submit.prevent="sortDeck">
        <label for="sort">Tri : </label>
        <select v-model="sortMode" name="sort" @change="sortDeck">
          <option value="default">Défaut</option>
          <option value="alphabetical">Alphabétique</option>
          <option value="chronological">Chronologique</option>
          <option value="ascending">Croissant</option>
          <option value="descending">Décroissant</option>
        </select>
      </form>
    </div>

    <div class="display">
      <form @submit.prevent="DisplayDeck">
        <label for="display">Affichage : </label>
        <select v-model="displayMode" name="display" @change="DisplayDeck">
          <option value="simple">Simple</option>
          <option value="list">Liste</option>
        </select>
      </form>
    </div>
  </div>

  <Pagination 
    :decks="sortedDecks" 
    :currentPage="currentPage" 
    @pageChanged="changePage" 
  />

  <div v-if="displayMode == 'simple'" class="deck-container-simple">
    <div v-for="deck in paginatedDecks" :key="deck._id">
      <Deck
        :display="displayMode"
        :deckTitle="deck.title"
        :deckDescription="deck.description"
        :deckLength="deck.flashcards.length"
        @showCards="showCards(deck._id)"
        @modifyDeck="openModifyDeckModal(deck._id)"
        @deleteDeck="openDeleteDeckModal(deck._id)"
      />
    </div>
  </div>

  <div v-if="displayMode == 'list'" class="deck-container-list">
    <div v-for="deck in paginatedDecks" :key="deck._id">
      <Deck
        :display="displayMode"
        :deckTitle="deck.title"
        :deckDescription="deck.description"
        :deckLength="deck.flashcards.length"
        @showCards="showCards(deck._id)"
        @modifyDeck="openModifyDeckModal(deck._id)"
        @deleteDeck="openDeleteDeckModal(deck._id)"
      />
    </div>
  </div>

  <!-- Modal de modification -->
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

  <!-- Modal de suppression -->
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
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";
import router from "@/router";
import { deleteDeck, updateDeck } from '../../services/apiService';
import Deck from "./Deck.vue";
import Pagination from "./Pagination.vue";

const props = defineProps({
  decks: Array,
});

const emit = defineEmits(["deckUpdated", "deckDeleted"]);

const deckTitle = ref("");
const deckDescription = ref("");
const sortMode = ref("default");
const displayMode = ref("simple");
const selectedDeckIndex = ref(null);
const currentPage = ref(1);
const decksPerPage = 10;
const isModalOpenPen = ref(false);
const isModalOpenTrash = ref(false);
const errorMessage = ref("");

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

const paginatedDecks = computed(() => {
  const start = (currentPage.value - 1) * decksPerPage;
  return sortedDecks.value.slice(start, start + decksPerPage);
});

const changePage = (newPage) => {
  currentPage.value = newPage;
};

const showCards = (id) => {
  router.push(`/dashboard/${id}`);
};

const openModifyDeckModal = (deckId) => {
  const deck = sortedDecks.value.find(d => d._id === deckId);
  if (deck) {
    selectedDeckIndex.value = deckId;
    deckTitle.value = deck.title;
    deckDescription.value = deck.description;
    isModalOpenPen.value = true;
  }
};

const confirmModifyDeck = async () => {
  const deckId = selectedDeckIndex.value;
  const deckData = {
    title: deckTitle.value.trim(),
    description: deckDescription.value.trim(),
  };

  try {
    await updateDeck(deckId, deckData);

    const deckToUpdate = props.decks.find(d => d._id === deckId);
    if (deckToUpdate) {
      deckToUpdate.title = deckData.title;       
      deckToUpdate.description = deckData.description;
    }

    closeModal();
  } catch (error) {
    console.error("Erreur lors de la modification du deck :", error);
    errorMessage.value = "Une erreur est survenue lors de la modification.";
  }
};


const openDeleteDeckModal = (deckId) => {
  const deck = sortedDecks.value.find(d => d._id === deckId);
  if (deck) {
    selectedDeckIndex.value = deckId;
    deckTitle.value = deck.title;
    isModalOpenTrash.value = true;
  }
};

const confirmDeleteDeck = async () => {
  try {
    await deleteDeck(selectedDeckIndex.value);
    
    const indexToDelete = props.decks.findIndex(d => d._id === selectedDeckIndex.value);
    if (indexToDelete !== -1) {
      props.decks.splice(indexToDelete, 1);  
    }

    closeModal();
    console.log("Deck supprimé :", selectedDeckIndex.value);
  } catch (error) {
    console.error("Erreur lors de la suppression du deck :", error);
  }
};


const closeModal = () => {
  isModalOpenPen.value = false;
  isModalOpenTrash.value = false;
  selectedDeckIndex.value = null;
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

button:hover {
    background-color: #b96500;
}



</style>
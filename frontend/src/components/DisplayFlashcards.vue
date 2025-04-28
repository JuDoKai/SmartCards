<template>
  <div class="title">
    <h1>Flashcards du deck {{ deckTitle }}</h1>
    <div class="return" @click="closeDeck">
      <img
        src="@/assets/icons/left-return-arrow.svg"
        title="Retour"
        alt="Retour"
        width="40"
        height="40"
      />
    </div>
  </div>

  <div class="flashcard-container">
    <div v-if="flashcardsList.length === 0">
      <span class="empty-list">La liste de flashcards est vide...</span>
    </div>

    <Swiper
      v-else
      :key="swiperKey"
      :modules="[Navigation, Pagination]"
      :navigation="true"
      :pagination="{ clickable: true }"
      class="swiper-container"
    >
      <SwiperSlide
        v-for="(flashcard, index) in flashcardsList"
        :key="flashcard._id"
        class="flashcard-slide"
      >
        <div class="flashcard-actions">
          <div class="switch" @click="flipFlashcard(index)">
            <img
              src="@/assets/icons/two-rotating-arrows.svg"
              title="Changer de face"
              alt="Changer de face"
              width="40"
              height="40"
            />
          </div>
          <div class="edit" @click="openEditFlashcardModal(index)">
            <img
              src="@/assets/icons/pen.svg"
              title="Modifier la Question/Réponse"
              alt="Modifier la Question/Réponse"
              width="40"
              height="40"
            />
          </div>
          <div class="remove" @click="openRemoveFlashcardModal(index)">
            <img
              src="@/assets/icons/trash.svg"
              title="Supprimer la Flashcard"
              alt="Supprimer la Flashcard"
              width="40"
              height="40"
            />
          </div>
        </div>
        <Flashcard
          v-if="flashcard.question && flashcard.answer"
          ref="flashcardRefs"
          :question="flashcard.question"
          :answer="flashcard.answer"
        />
      </SwiperSlide>
    </Swiper>
  </div>

  <!-- Modal Modification -->
  <div v-if="isModalEditOpen" class="overlay">
    <div class="modal">
      <strong><p>Modifier la Flashcard</p></strong>

      <form @submit.prevent="confirmModifyFlashcard">
        <div class="form-slot">
          <label for="question">Question </label>
          <input type="text" v-model.trim="question" required />
        </div>
        <div class="form-slot">
          <label for="answer">Réponse </label>
          <input type="text" v-model.trim="answer" required />
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button type="submit" :disabled="question.trim().length === 0 || answer.trim().length === 0">Valider</button>
        <button type="button" @click="closeModal">Annuler</button>
      </form>
    </div>
  </div>

  <!-- Modal Suppression -->
  <div v-if="isModalRemoveOpen" class="overlay">
    <div class="modal">
      <p>Voulez-vous supprimer définitivement la Flashcard ?</p>
      <button type="button" @click="confirmDeleteFlashcard">Valider</button>
      <button type="button" @click="closeModal">Annuler</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Flashcard from "@/components/Flashcard.vue";
import { deleteFlashcard, modifyFlashcard } from "../../services/apiService";

const props = defineProps({
  flashcards: Array,
  deckTitle: String
});

const emit = defineEmits(['flashcardDeleted']);


const flashcardRefs = ref([]);
const flashcardsList = ref([...props.flashcards]); // Copie réactive des flashcards
const router = useRouter();

const question = ref("");
const answer = ref("");
const errorMessage = ref("");
const selectedFlashcardIndex = ref(null);
const isModalEditOpen = ref(false);
const isModalRemoveOpen = ref(false);
const swiperKey = ref(0);

watch(() => props.flashcards, (newFlashcards) => {
  flashcardsList.value = [...newFlashcards];
});

const closeModal = () => {
  isModalEditOpen.value = false;
  isModalRemoveOpen.value = false;
  selectedFlashcardIndex.value = null;
  question.value = "";
  answer.value = "";
  errorMessage.value = "";
};

const flipFlashcard = (index) => {
  if (flashcardRefs.value[index]) {
    flashcardRefs.value[index].toggleFlip();
  }
};

const openEditFlashcardModal = (index) => {
  selectedFlashcardIndex.value = index;
  question.value = flashcardsList.value[index].question;
  answer.value = flashcardsList.value[index].answer;
  isModalEditOpen.value = true;
};

const openRemoveFlashcardModal = (index) => {
  selectedFlashcardIndex.value = index;
  isModalRemoveOpen.value = true;
};

const confirmModifyFlashcard = async () => {
  const flashcardId = flashcardsList.value[selectedFlashcardIndex.value]._id;
  const flashcardData = {
    question: question.value.trim(),
    answer: answer.value.trim(),
  };

  try {
    await modifyFlashcard(flashcardId, flashcardData);
    flashcardsList.value[selectedFlashcardIndex.value].question = flashcardData.question;
    flashcardsList.value[selectedFlashcardIndex.value].answer = flashcardData.answer;
    closeModal();
  } catch (error) {
    console.error("Erreur lors de la modification de la flashcard :", error);
    errorMessage.value = "Une erreur est survenue lors de la modification.";
  }
};

const confirmDeleteFlashcard = async () => {
  const flashcardId = flashcardsList.value[selectedFlashcardIndex.value]._id;
  try {
    await deleteFlashcard(flashcardId);
    flashcardsList.value.splice(selectedFlashcardIndex.value, 1);
    swiperKey.value++; 
    emit('flashcardDeleted');
    closeModal();
    console.log("Flashcard supprimée :", flashcardId);
  } catch (error) {
    console.error("Erreur lors de la suppression de la flashcard :", error);
  }
};

const closeDeck = () => {
  router.push("/dashboard");
};
</script>

<style scoped>
h1 {
  margin-left: 1rem;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 1rem;
}

.flashcard-container {
  height: 80vh;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid black;
  padding: 1rem;
}

.empty-list {
  font-size: clamp(1rem, 5vw, 3rem);
  opacity: 0.5;
}

.swiper-container {
  width: 100%;
  height: 500px;
}

.flashcard-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flashcard-actions {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.switch,
.edit,
.remove,
.return {
  cursor: pointer;
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

</style>

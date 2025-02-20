<template>
    <Navbar />
    <div class="title">
      <h1>Flashcards du deck</h1>
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
      <div v-if="flashcards.length === 0">
        <span class="empty-list">La liste de flashcards est vide...</span>
      </div>
      <Swiper
        v-else
        :modules="[Navigation, Pagination]"
        :navigation="true"
        :pagination="{ clickable: true }"
        class="swiper-container"
      >
        <SwiperSlide
          v-for="flashcard in flashcards"
          :key="flashcard._id"
          class="flashcard-slide"
        >
          <!-- Vérifie si flashcard.question et flashcard.answer sont définis -->
          <Flashcard
            v-if="flashcard.question && flashcard.answer"
            :question="flashcard.question"
            :answer="flashcard.answer"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { Navigation, Pagination } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";
  
  import Navbar from "@/components/Navbar.vue";
  import Flashcard from "@/components/Flashcard.vue";
  import { getAllFlashcardsByDeckId } from "../../services/apiService";
  
  const props = defineProps(["id"]);
  const flashcards = ref([]);
  const router = useRouter();
  
  onMounted(async () => {
    try {
      const data = await getAllFlashcardsByDeckId(props.id);
      flashcards.value = data;
    } catch (error) {
      console.error("Erreur lors du chargement du deck:", error);
    }
  });
  
  const closeDeck = () => {
    router.push("/dashboard/");
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
  
  .return {
    cursor: pointer;
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
    height: 600px;
  }
  
  .flashcard-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
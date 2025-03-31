<template>
    <div v-if="display == 'simple'" class="deck-container-simple">
        <div class="deck-item">
            <div class="deck-title"><strong>{{ props.deckTitle }}</strong><br /></div>
            <div class="deck-description"><i>{{ props.deckDescription }}</i></div>
            <div class="deck-capacity">
                <p v-if="props.deckLength == 0">Deck vide</p>
                <p v-else-if="props.deckLength == 1">1 carte</p>
                <p v-else>{{ props.deckLength }} cartes</p>
            </div>

            <div class="options">
                <div @click="$emit('showCards')">
                <div class="eye">
                    <img
                    src="@/assets/icons/eye.svg"
                    title="Afficher les cartes du deck"
                    alt="Afficher les cartes du deck"
                    />
                </div>
                </div>
                <div @click="$emit('modifyDeck')" class="pen">
                <img
                    src="@/assets/icons/pen.svg"
                    title="Modifier le deck"
                    alt="Modifier le Deck"
                />
                </div>
                <div @click="$emit('deleteDeck')" class="trash">
                <img
                    src="@/assets/icons/trash.svg"
                    title="Supprimer le deck"
                    alt="Supprimer le Deck"
                />
                </div>
            </div>
        </div>
    </div>

    <div v-if="display == 'list'" class="deck-container-list">
        <div class="deck-item">
            <div class="deck-title"><strong>{{ props.deckTitle }}</strong><br /></div>
            <div class="deck-description"><i>{{ props.deckDescription }}</i></div>
            <div class="deck-capacity">
                <p v-if="props.deckLength == 0">Deck vide</p>
                <p v-else-if="props.deckLength == 1">1 carte</p>
                <p v-else>{{ props.deckLength }} cartes</p>
            </div>

            <div class="options">
                <div @click="$emit('showCards')">
                <div class="eye">
                    <img
                    src="@/assets/icons/eye.svg"
                    title="Afficher les cartes du deck"
                    alt="Afficher les cartes du deck"
                    />
                </div>
                </div>
                <div @click="$emit('modifyDeck')" class="pen">
                <img
                    src="@/assets/icons/pen.svg"
                    title="Modifier le deck"
                    alt="Modifier le Deck"
                />
                </div>
                <div @click="$emit('deleteDeck')" class="trash">
                <img
                    src="@/assets/icons/trash.svg"
                    title="Supprimer le deck"
                    alt="Supprimer le Deck"
                />
                </div>
            </div>
        </div>
    </div>




</template>

<script setup>

const props = defineProps({
    display: String,
    deckTitle: String,
    deckDescription: String,
    deckLength: Number,
    deckCreatedDate: Date
})
                  
defineEmits(["showCards", "modifyDeck", "deleteDeck"]);


</script>

<style scoped>

/* 
    Affichage simple 
*/


.deck-container-simple .deck-item {
  width: 90%;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: #f0f0f0;
  border: 4px solid black;
  border-radius: 8px;
  padding: 1rem;
  background-color: rgb(255, 244, 224);
  font-size: clamp(0.75rem, 4vw, 1.4rem);
}


.deck-container-simple .options {
    display: flex;
    gap: 15px;
}

.deck-container-simple .options img {
  height: 30px;
  width: 30px;
}

/* 
    Affichage en liste 
*/

.deck-container-list {
  display: flex;
  align-items: stretch;
}


.deck-container-list .deck-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  background-color: rgb(255, 244, 224);
  font-size: clamp(0.75rem, 4vw, 1.4rem);
}

.deck-container-list > div:nth-child(even) .deck-item {
  background-color: #ffddb7;
}

.deck-container-list .deck-title {
    margin-left: 0.5rem;
    width: 200px;
    min-width: 40%;
    overflow-wrap: break-word; 

}

.deck-container-list .deck-description {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    text-align: center;
    box-sizing: border-box;
    overflow-wrap: break-word; 

}

.deck-container-list .deck-capacity {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40%;
    text-align: center;
    box-sizing: border-box;
    word-wrap: break-word;  
}

.deck-container-list .options {
    display: flex;
    gap: 15px;
    margin-right: 0.5rem;
}

.deck-container-list .options img {
  height: 20px;
  width: 20px;
}


.deck-container p {
  font-size: clamp(0.75rem, 4vw, 1.4rem);
 
}

.deck-item {
  display: flex;
}

 
.deck-capacity p{
    margin: 0;
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

/*  
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

*/


</style>
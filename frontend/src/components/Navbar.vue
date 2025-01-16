<template>
    <nav class="nav-container">
        <a href="/dashboard">SmartCards</a>
        <div v-if="isSmallScreen" class="menu-icon">
            <div class="small-menu">
                <i class="menu" @click="openMenu">
                    <img
                        src="@/assets/icons/menu.svg"
                        title="Menu"
                        alt="Menu"
                        width="50"
                        height="10"
                    />
                </i>
                <ul v-if="isMenuOpen">
                    <li>
                        <img
                            src="@/assets/icons/profile.svg"
                            title="Accéder au profil"
                            alt="Accéder au profil"
                            width="20"
                            height="20"
                            />Profil
                    </li>
                    <li @click="logout()">
                        <img
                            src="@/assets/icons/logout.svg"
                            title="Se déconnecter"
                            alt="Se Déconnecter"
                            width="20"
                            height="20"
                            />Déconnexion
                    </li>
                </ul>
            </div>
            
        </div>
        <div v-else>
            <div class="big-menu">
                <ul>
                <li>
                    <img
                        src="@/assets/icons/profile.svg"
                        title="Accéder au profil"
                        alt="Accéder au profil"
                        width="20"
                        height="20"
                        />Profil
                </li>
                <li @click="logout()">
                    <img
                        src="@/assets/icons/logout.svg"
                        title="Se déconnecter"
                        alt="Se Déconnecter"
                        width="20"
                        height="20"
                        />Déconnexion
                </li>
            </ul>


            </div>
          
        </div>

        <!--  
        <div class="log">
            <p> {{ user.name }}</p>
            <button @click="logout" class="logout">Se Déconnecter</button>
        </div>
         -->
    </nav>
</template>

<script setup>
import router from '@/router';
import { ref, onMounted, onUnmounted } from 'vue';

const user = defineProps({
    name: String
});

const logout = () => {
    localStorage.removeItem('authToken');

    router.push('/');
}

const isSmallScreen = ref(false);
const isMenuOpen = ref(false);

const checkScreenSize = () => {
    isSmallScreen.value = window.innerWidth < 540;
    if ((window.innerWidth == 540 && isMenuOpen.value == true)   ){
        isMenuOpen.value = !isMenuOpen.value;
    }
};

const closeMenu = () => {
    isSmallScreen.value = window.innerWidth < 540;
};

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize); 
});

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
});

const openMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    console.log(isMenuOpen.value);
}

</script>



<style scoped>

.nav-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    height: 5rem;
    align-items: center;
    padding: 0 0rem 0 0rem;
    border-bottom: 2px solid black;

}

.nav-container a {
    font-family: Georgia serif;
    font-style: italic;
    font-size: clamp(2.5rem, 5vw, 3rem);
    color: black;
    text-decoration: none;
    margin-left: 20px;
}

.nav-container .log {
    font-size: clamp(1rem, 3vw, 1.5rem);
    line-height: 0.5rem;
}

.menu-icon {
    font-size: clamp(1rem, 5vw, 3rem);
}

.logout {
    height: 3rem;
    width: auto;
    border-radius: 20px;
    border: 2px solid black;
    font-size: 0.875rem;
    padding: 8px 16px;
}


.small-menu ul {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50px;
    right: 0;
    bottom: 0;
}

.small-menu ul li {
    display: flex;
    align-items: center;
    background-color: #db8206;
    border: 3px solid black;
    list-style: none;
    gap: 10px;
    font-size: 1.25rem;

}

.small-menu ul :hover {
    background-color: #b96500;
}

.small-menu ul li img{
    height: 40px;
    gap: 10px;
}

.small-menu-open {
    border: 2px solid red;
}

.menu img {
    height: 50px;
    border: 5px solid black;
    position: absolute;
    top: 10px;
    right: 0;
}

.big-menu {
    margin-right: 20px;
}

.big-menu ul {
    display: flex;
    flex-direction: row;
    gap: 20px;  
}

.big-menu ul li {
    border: 3px solid black;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 5px;
    height: 100%;
    font-size: clamp(1rem, 5vw, 1.5rem);
}


</style>


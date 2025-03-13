<template>
   
    <div class="container">
        <p>Chargement en cours</p>
        <div class="loader"></div>
    </div>
</template>


<style scoped>

.container{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    position: fixed;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;

}

p {
    font-size: 1.5rem;
}

.loader {
  width: 40px;
  aspect-ratio: 2.5;
  --_g: no-repeat radial-gradient(circle closest-side,#000 90%,#0000);
  background: 
    var(--_g) 0%   50%,
    var(--_g) 50%  50%,
    var(--_g) 100% 50%;
  background-size: calc(100%/3) 50%;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
    20%{background-position:0%   0%, 50%  50%,100%  50%}
    40%{background-position:0% 100%, 50%   0%,100%  50%}
    60%{background-position:0%  50%, 50% 100%,100%   0%}
    80%{background-position:0%  50%, 50%  50%,100% 100%}
}
</style>

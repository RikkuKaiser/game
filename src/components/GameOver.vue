<template>
  <div class="overlay">
    <div class="box">
      <h2>¡Juego Terminado!</h2>
      <button @click="restartGame">Reiniciar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'


const game = useGameStore()

function restartGame() {
  game.initBoard()
}
</script>

<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4caf50;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>

<template>
  <div class="game-wrapper">
    <!-- Puntaje -->
    <div class="score-board">
      <p class="score">Puntaje: {{ score }}</p>
      <p class="high-score">Récord: {{ highScore }}</p>
    </div>

    <!-- Bolita flotante -->
    <div class="floating-row">
      <div
        v-for="col in columns"
        :key="'float-' + col"
        class="cell"
      >
        <div
          v-if="currentBall.column === col - 1"
          :class="['ball', `ball-${currentBall.value}`]"
        >
          {{ currentBall.value }}
        </div>
      </div>
    </div>

    <!-- Tablero -->
    <div class="grid">
      <div
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        class="row"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          @click="handleColumnSelect(colIndex)"
          @touchstart.prevent="handleColumnSelect(colIndex)"
        >
          <div
            v-if="cell > 0"
            :class="[
              'ball',
              `ball-${cell}`,
              fusedCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'fuse' : ''
            ]"

          >
            {{ cell }}
          </div>
        </div>
      </div>
    </div>

    <!-- Componente Game Over -->
    <GameOver v-if="isGameOver" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/gameStore'
import GameOver from './GameOver.vue'

const game = useGameStore()
const {
  board,
  currentBall,
  isGameOver,
  score,
  highScore,
  fusedCells // 👈 Faltaba esto
} = storeToRefs(game)

const columns = board.value[0].length

// 🎮 Teclado
const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'a') game.moveBall('left')
  if (e.key === 'd') game.moveBall('right')
  if (e.key === ' ') game.dropBall()
}

// 📱 Touch por columna
const touchTimeout = ref<number | null>(null)

function startDelayedDrop(colIndex: number) {
  if (isGameOver.value) return
  cancelDelayedDrop()

  touchTimeout.value = window.setTimeout(() => {
    game.currentBall.column = colIndex
    game.dropBall()
  }, 2000) // ⏱ Delay controlado
}

function cancelDelayedDrop() {
  if (touchTimeout.value !== null) {
    clearTimeout(touchTimeout.value)
    touchTimeout.value = null
  }
}

// 🖱️ Click directo
function handleColumnSelect(colIndex: number) {
  if (isGameOver.value) return
  game.currentBall.column = colIndex
  game.dropBall()
}

onMounted(() => {
  game.initBoard()
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>

<style scoped>
.game-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  touch-action: manipulation;
}
.score-board {
  background: linear-gradient(135deg, #2c5048, #485e34);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  font-family: 'Orbitron', sans-serif;
}

.score-board:hover {
  transform: scale(1.02);
}

.score, .high-score {
  font-size: 20px;
  margin: 4px 0;
  text-shadow: 1px 1px 2px black;
}

.score {
  color: #00e676;
}

.high-score {
  color: #ffd600;
}

@keyframes floatIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}


.floating-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  display: flex;
  gap: 8px;
}

.cell {
  width: 50px;
  height: 50px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.ball {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  transition: transform 0.2s ease;
}

.ball-1 { background-color: #4caf50; }
.ball-2 { background-color: #ff9800; }
.ball-3 { background-color: #f44336; }
.ball-4 { background-color: #3f51b5; }
.ball-5 { background-color: #9c27b0; }
.ball-6 { background-color: #009688; }
.ball-7 { background-color: #795548; }
.ball-8 { background-color: #607d8b; }
.ball-9 { background-color: #e91e63; }
.ball-10 {
  background-color: #ffeb3b;
  color: #000;
}

.ball.fuse {
  animation: pop 0.2s ease;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>

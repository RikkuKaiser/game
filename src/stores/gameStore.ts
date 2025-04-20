import { defineStore } from 'pinia'

const ROWS = 6
const COLUMNS = 5

export const useGameStore = defineStore('game', {
  state: () => ({
    board: Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0)) as number[][],
    currentBall: {
      value: 1,
      column: Math.floor(COLUMNS / 2),
    },
    isGameOver: false // ✅ Nuevo estado
  }),

  actions: {
    // Inicializa tablero y genera primera bolita
    initBoard() {
      this.board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0))
      this.isGameOver = false
      this.generateBall()
    },

    // Mueve bolita flotante a izquierda o derecha
    moveBall(direction: 'left' | 'right') {
      if (this.isGameOver) return
      if (direction === 'left' && this.currentBall.column > 0) {
        this.currentBall.column--
      }
      if (direction === 'right' && this.currentBall.column < COLUMNS - 1) {
        this.currentBall.column++
      }
    },

    // Deja caer bolita, fusiona si puede, aplica gravedad y genera nueva
    dropBall() {
      if (this.isGameOver) return

      const col = this.currentBall.column
      let rowToPlace = -1

      for (let row = ROWS - 1; row >= 0; row--) {
        if (this.board[row][col] === 0) {
          rowToPlace = row
          break
        }
      }

      if (rowToPlace === -1) {
        console.warn('Columna llena')
        return
      }

      this.board[rowToPlace][col] = this.currentBall.value

      this.handleFusionChain(rowToPlace, col)
      this.applyGravity()

      this.generateBall()
      this.checkGameOver() // ✅ Verificamos si se acabó el juego
    },

    // Fusiona adyacentes iguales y elimina si llega a 11
    handleFusionChain(row: number, col: number) {
      let didFuse = false

      do {
        didFuse = false
        const value = this.board[row][col]

        const directions = [
          [1, 0], [-1, 0], [0, -1], [0, 1]
        ]

        for (const [dr, dc] of directions) {
          const r = row + dr
          const c = col + dc

          if (
            r >= 0 && r < ROWS &&
            c >= 0 && c < COLUMNS &&
            this.board[r][c] === value
          ) {
            const [targetRow, targetCol] = r > row ? [r, c] : [row, col]
            const [otherRow, otherCol] = r > row ? [row, col] : [r, c]

            const newValue = value + 1

            if (newValue === 11) {
              this.board[targetRow][targetCol] = 0 // eliminar bolita
            } else {
              this.board[targetRow][targetCol] = newValue
            }

            this.board[otherRow][otherCol] = 0
            row = targetRow
            col = targetCol

            this.applyGravity()
            didFuse = true
            break
          }
        }
      } while (didFuse)
    },

    // Hace que las bolitas caigan hacia abajo
    applyGravity() {
      for (let col = 0; col < COLUMNS; col++) {
        let pointer = ROWS - 1

        for (let row = ROWS - 1; row >= 0; row--) {
          if (this.board[row][col] !== 0) {
            const value = this.board[row][col]
            if (pointer !== row) {
              this.board[pointer][col] = value
              this.board[row][col] = 0
            }
            pointer--
          }
        }
      }
    },

    // Genera una nueva bolita con probabilidad 70%-25%-5%
    generateBall() {
      const rand = Math.random()
      let value = 1

      if (rand < 0.7) value = 1
      else if (rand < 0.95) value = 2
      else value = 3

      this.currentBall = {
        value,
        column: Math.floor(COLUMNS / 2)
      }
    },

    // ✅ Verifica si ya no queda espacio
    checkGameOver() {
      const hasEmpty = this.board.some(row => row.includes(0))
      if (!hasEmpty) {
        this.isGameOver = true
        console.warn('¡Juego terminado!')
      }
    }
  }
})

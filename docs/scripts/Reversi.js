import Cell from "./Cell.js";
import Player from "./Player.js";
import CellState from "./CellState.js";
import Winner from "./Winner.js";
import CellMoves from "./CellMoves.js";

export default class Reversi {
    constructor(nrows, ncols) {
        this.rows = nrows;
        this.cols = ncols;
        this.turn = Player.PLAYER2;
        this.board = this.startBoard();
    }

    startBoard() {
        let matrix = Array(this.rows).fill().map(() => Array(this.cols).fill(CellState.EMPTY));
        let row = Math.floor(this.rows / 2);
        let col = Math.floor(this.cols / 2);
        matrix[row - 1][col] = CellState.PLAYER1;
        matrix[row][col] = CellState.PLAYER2;
        matrix[row - 1][col - 1] = CellState.PLAYER2;
        matrix[row][col - 1] = CellState.PLAYER1;
        return matrix;
    }

    getBoard() {
        return this.board;
    }

    getTurn() {
        return this.turn;
    }

    countPieces(peca) {
        return this.board.flat().reduce((a, b) => a + (b === peca ? 1 : 0), 0);
    }

    cellsToChange(player, endCell) {
        let ok = [];
        let c = (player === Player.PLAYER1) ? CellState.PLAYER1 : CellState.PLAYER2;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                ok.push(this.oneDirection(c, endCell, i, j));
            }
        }
        return ok.flat();
    }

    move(player, endCell) {
        let { x, y } = endCell;
        if ((player === Player.PLAYER2 && this.turn === Player.PLAYER1) || (player === Player.PLAYER1 && this.turn === Player.PLAYER2)) {
            throw new Error("It's not your turn.");
        }
        if (!this.onBoard(endCell)) {
            throw new Error("Cell is not on board.");
        }
        if (this.board[x][y] !== CellState.EMPTY) {
            throw new Error("Cell is not empty.");
        }
        if (this.cellsToChange(player, endCell).length === 0) {
            throw new Error("Cell does not change opponent pieces.");
        }
        let coords = this.cellsToChange(player, endCell);
        if (coords.length > 0) {
            coords.push(endCell);
            coords.forEach(({ x, y }) => this.board[x][y] = (player === Player.PLAYER1) ? CellState.PLAYER1 : CellState.PLAYER2);
        }
        return this.endOfGame();
    }

    totalNumberOfPiecesToCapture(player) {
        return this.board.flat().reduce((acc, cur, i) => acc + ((cur === CellState.EMPTY) ? this.cellsToChange(player, new Cell(Math.floor(i / this.cols), i % this.cols)).length : 0), 0);
    }

    endOfGame() {
        let cp1 = this.totalNumberOfPiecesToCapture(Player.PLAYER1), cp2 = this.totalNumberOfPiecesToCapture(Player.PLAYER2);
        if (this.countPieces(CellState.EMPTY) === 0 || (cp1 === 0 && cp2 === 0)) {
            let qp1 = this.countPieces(CellState.PLAYER1), qp2 = this.countPieces(CellState.PLAYER2);
            return qp1 > qp2 ? Winner.PLAYER1 : qp1 < qp2 ? Winner.PLAYER2 : Winner.DRAW;
        }
        if ((this.turn === Player.PLAYER1 && cp2 > 0) || (this.turn === Player.PLAYER2 && cp1 > 0)) {
            this.turn = (this.turn === Player.PLAYER1) ? Player.PLAYER2 : Player.PLAYER1;
        }
        return Winner.NONE;
    }

    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.rows) && inLimit(y, this.cols));
    }

    oneDirection(player, endCell, h, v) {
        let row, col, coords = [];
        let { x, y } = endCell;
        for (row = x + v, col = y + h; this.onBoard(new Cell(row, col)); row += v, col += h) {
            if (this.board[row][col] === player) {
                break;
            } else if (this.board[row][col] === CellState.EMPTY) {
                coords = [];
                break;
            } else {
                coords.push(new Cell(row, col));
            }
        }
        return this.onBoard(new Cell(row, col)) ? coords : [];
    }
    possibleMoves(player) {
        let p = player || this.turn;
        let moves = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] === CellState.EMPTY) {
                    let cell = new Cell(i, j);
                    let num = this.cellsToChange(p, cell).length;
                    moves.push(new CellMoves(cell, num));
                }
            }
        }
        return moves;
    }
}

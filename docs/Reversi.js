import {Cell} from "./Cell.js";
import {Player} from "./Player.js";
import {CellState} from "./CellState.js";
import {Winner} from "./Winner.js";
import {CellMoves} from "./CellMoves.js";

function Reversi(nrows, ncols) {
    const rows = nrows;
    const cols = ncols;
    let turn = Player.PLAYER2;
    let board = startBoard();

    function startBoard() {
        let matrix = Array(rows).fill().map(() => Array(cols).fill(CellState.EMPTY));
        let row = Math.floor(rows / 2);
        let col = Math.floor(cols / 2);
        matrix[row - 1][col] = CellState.PLAYER1;
        matrix[row][col] = CellState.PLAYER2;
        matrix[row - 1][col - 1] = CellState.PLAYER2;
        matrix[row][col - 1] = CellState.PLAYER1;
        return matrix;
    }

    function getBoard() {
        return board;
    }

    function getTurn() {
        return turn;
    }

    function countPieces(peca) {
        return board.flat().reduce((a, b) => a + (b === peca ? 1 : 0), 0);
    }

    function cellsToChange(player, endCell) {
        let ok = [];
        let c = (player === Player.PLAYER1) ? CellState.PLAYER1 : CellState.PLAYER2;
        /* Pode jogar nesta célula? */
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                ok.push(oneDirection(c, endCell, i, j));
            }
        }
        return ok.flat();
    }

    function move(player, endCell) {
        let {x, y} = endCell;
        if ((player === Player.PLAYER2 && turn === Player.PLAYER1) || (player === Player.PLAYER1 && turn === Player.PLAYER2)) {
            throw new Error("It's not your turn.");
        }
        if (!onBoard(endCell)) {
            throw new Error("Cell is not on board.");
        }
        if (board[x][y] !== CellState.EMPTY) {
            throw new Error("Cell is not empty.");
        }
        if (cellsToChange(player, endCell).length === 0) {
            throw new Error("Cell does not change opponent pieces.");
        }
        let coords = cellsToChange(player, endCell);
        if (coords.length > 0) {
            coords.push(endCell);
            coords.forEach(({x, y}) => board[x][y] = (player === Player.PLAYER1) ? CellState.PLAYER1 : CellState.PLAYER2);
        }
        return endOfGame();
    }

    function totalNumberOfPiecesToCapture(player) {
        return board.flat().reduce((acc, cur, i) => acc + ((cur === CellState.EMPTY) ? cellsToChange(player, new Cell(Math.floor(i / cols), i % cols)).length : 0), 0);
    }

    function endOfGame() {
        let cp1 = totalNumberOfPiecesToCapture(Player.PLAYER1), cp2 = totalNumberOfPiecesToCapture(Player.PLAYER2);
        if (countPieces(CellState.EMPTY) === 0 || (cp1 === 0 && cp2 === 0)) {
            let qp1 = countPieces(CellState.PLAYER1), qp2 = countPieces(CellState.PLAYER2);
            return qp1 > qp2 ? Winner.PLAYER1 : qp1 < qp2 ? Winner.PLAYER2 : Winner.DRAW;
        }
        if ((turn === Player.PLAYER1 && cp2 > 0) || (turn === Player.PLAYER2 && cp1 > 0)) {
            turn = (turn === Player.PLAYER1) ? Player.PLAYER2 : Player.PLAYER1;
        }
        return Winner.NONE;
    }

    function onBoard( {x, y}) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, rows) && inLimit(y, cols));
    }

    function oneDirection(player, endCell, h, v) {
        let row, col, coords = [];
        let {x, y} = endCell;
        for (row = x + v, col = y + h; onBoard(new Cell(row, col)); row += v, col += h) {
            if (board[row][col] === player) {
                break;
            } else if (board[row][col] === CellState.EMPTY) {
                coords = [];
                break;
            } else {
                coords.push(new Cell(row, col));
            }
        }
        return onBoard(new Cell(row, col)) ? coords : [];
    }
    function possibleMoves(player) {
        let p = player || turn;
        let moves = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === CellState.EMPTY) {
                    let cell = new Cell(i, j);
                    let num = cellsToChange(p, cell).length;
                    moves.push(new CellMoves(cell, num));
                }
            }
        }
        return moves;
    }

    return {getBoard, move, getTurn, possibleMoves};
}

export {Reversi};

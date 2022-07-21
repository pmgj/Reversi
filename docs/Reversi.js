import {Cell} from "./Cell.js";
import {Jogador} from "./Jogador.js";
import {Player} from "./Player.js";
import {CellState} from "./CellState.js";

function Reversi(nrows, ncols) {
    const rows = nrows;
    const cols = ncols;
    let turn = Player.PLAYER2;
    let board = startBoard();
    let mensagem = "";

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

    function mudarVez() {
        turn = (turn === Player.PLAYER1) ? Player.PLAYER2 : Player.PLAYER1;
    }

    function getTurn() {
        return turn;
    }

    function qtdDePecas(peca) {
        return board.flat().reduce((a, b) => a + (b === peca ? 1 : 0), 0);
    }

    function casasPossiveis(player) {
        return board.flat().reduce((acc, cur, i) => acc + ((cur === CellState.EMPTY) ? mudarPecas(player, new Cell(Math.floor(i / cols), i % cols)).length : 0), 0);
    }

    function testarJogada(player, endCell) {
        let {x, y} = endCell;
        /* Não é a sua vez de jogar? */
        if ((player === Player.PLAYER2 && turn === Player.PLAYER1) || (player === Player.PLAYER1 && turn === Player.PLAYER2)) {
            return false;
        }
        /* Célula não está no tabuleiro? */
        if (!onBoard(endCell)) {
            return false;
        }
        /* Célula não está vazia? */
        if (board[x][y] !== CellState.EMPTY) {
            return false;
        }
        /* Célula não muda peças do adversário? */
        if (mudarPecas(player, endCell).length === 0) {
            return false;
        }
        return true;
    }

    function mudarPecas(player, endCell) {
        let ok = [];
        let c = (player === Player.PLAYER1) ? CellState.PLAYER1 : CellState.PLAYER2;
        /* Pode jogar nesta célula? */
        for (let i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                ok.push(oneDirection(c, endCell, i, j));
            }
        }
        return ok.flat();
    }

    function executarJogada(player, endCell) {
        let coords = mudarPecas(player, endCell);
        if (coords.length > 0) {
            coords.push(endCell);
            coords.forEach(c => board[c.getX()][c.getY()] = (player === Player.PLAYER1) ? CellState.PLAYER1 : CellState.PLAYER2);
        }
    }

    function mover(player, endCell) {
        if (testarJogada(player, endCell)) {
            executarJogada(player, endCell);
            posJogada();
        }
    }

    function setMessage(msg) {
        mensagem = msg;
    }

    function getMessage() {
        return mensagem;
    }

    function posJogada() {
        let cp1 = casasPossiveis(Player.PLAYER1), cp2 = casasPossiveis(Player.PLAYER2);
        if (qtdDePecas(CellState.EMPTY) === 0 || (cp1 === 0 && cp2 === 0)) {
            let qp1 = qtdDePecas(CellState.PLAYER1), qp2 = qtdDePecas(CellState.PLAYER2);
            setMessage(qp1 > qp2 ? "As brancas venceram." : qp1 < qp2 ? "As pretas venceram." : "Empate.");
        } else {
            if (turn === Player.PLAYER1) {
                if (cp2 === 0) {
                    setMessage("Brancas jogam novamente.");
                } else {
                    mudarVez();
                    setMessage("Pretas jogam.");
                }
            } else {
                if (cp1 === 0) {
                    setMessage("Pretas jogam novamente.");
                } else {
                    mudarVez();
                    setMessage("Brancas jogam.");
                }
            }
        }
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

    return {getBoard, mudarPecas, mover, getMessage, getTurn, qtdDePecas};
}

export {Reversi};

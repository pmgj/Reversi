import {Reversi} from "./Reversi.js";
import {Jogador} from "./Jogador.js";
import {CellState} from "./CellState.js";
import {Player} from "./Player.js";
import {Cell} from "./Cell.js";

function GUI() {
    let game, jogador;
    function coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    function setMessage(mensagem) {
        let p = document.querySelector("p");
        p.innerHTML = mensagem;
        resetBoard();
        let td1 = document.querySelector("p + table tr:nth-child(2) td:nth-child(2)");
        td1.textContent = game.qtdDePecas(CellState.PLAYER1);
        let td2 = document.querySelector("p + table tr:nth-child(3) td:nth-child(2)");
        td2.textContent = game.qtdDePecas(CellState.PLAYER2);
        jogadasPossiveis();
    }
    function jogarComputador() {
        let c = jogador.jogar(game);
        game.mover(CellState.PLAYER1, c);
        setMessage(game.getMessage());
    }
    function jogar() {
        let coords = coordinates(this);
        game.mover(game.getTurn() === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2, coords);
        setMessage(game.getMessage());
        setTimeout(jogarComputador, 2000);
    }
    function jogar2() {
        let coords = coordinates(this);
        game.mover(game.getTurn() === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2, coords);
        setMessage(game.getMessage());
    }
    function jogadasPossiveis() {
        let player = game.getTurn() === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        let tds = document.querySelectorAll("#tabuleiro td");
        tds.forEach(cell => {
            if (!cell.firstChild) {
                let coords = coordinates(cell);
                let num = game.mudarPecas(player, coords).length;
                if (num > 0) {
                    cell.className = "selecionado";
                    cell.innerHTML = num;
                }
            }
        });
    }
    function registerEvents() {
        let iRows = document.querySelector("input[name='rows']");
        let iCols = document.querySelector("input[name='cols']");
        let bStart = document.querySelector("input[name='start']");
        iRows.onchange = changeBoardSize;
        iCols.onchange = changeBoardSize;
        bStart.onclick = changeBoardSize;
        jogador = new Jogador(CellState.PLAYER1);
        changeBoardSize();
    }
    function resetBoard() {
        let board = game.getBoard();
        let rows = board.length;
        let cols = board[0].length;
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < rows; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < cols; j++) {
                let td = document.createElement("td");
                td.innerHTML = (board[i][j] === CellState.EMPTY ? "" : (board[i][j] === CellState.PLAYER1 ? '<img src="imagens/Pedra-Branca.svg" alt="">' : '<img src="imagens/Pedra-Preta.svg" alt="">'));
                td.className = "";
                if (board[i][j] === CellState.EMPTY) {
                    td.onclick = jogar2;
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    function changeBoardSize() {
        let iRows = document.querySelector("input[name='rows']");
        let iCols = document.querySelector("input[name='cols']");
        let cols = parseInt(iCols.value);
        let rows = parseInt(iRows.value);
        game = new Reversi(rows, cols);
        setMessage("Pretas jogam.");
    }
    return {registerEvents};
}
let gui = new GUI();
gui.registerEvents();
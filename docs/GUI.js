import {Reversi} from "./Reversi.js";
import {ComputerPlayer} from "./ComputerPlayer.js";
import {CellState} from "./CellState.js";
import {Player} from "./Player.js";
import {Cell} from "./Cell.js";

function GUI() {
    let game, computer;
    function coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    function setMessage(msg) {
        let message = document.getElementById("message");
        message.innerHTML = msg;
    }
    function changeMessage(m) {
        let objs = {DRAW: "Draw!", PLAYER2: "Black's win!", PLAYER1: "White's win!"};
        if (objs[m]) {
            setMessage(`Game Over! ${objs[m]}`);
        } else {
            let msgs = {PLAYER1: "White's turn.", PLAYER2: "Black's turn."};
            setMessage(msgs[game.getTurn()]);
            let td1 = document.querySelector("p + table tr:nth-child(2) td:nth-child(2)");
            td1.textContent = document.querySelectorAll("#tabuleiro img[src*='Branca']").length;
            let td2 = document.querySelector("p + table tr:nth-child(3) td:nth-child(2)");
            td2.textContent = document.querySelectorAll("#tabuleiro img[src*='Preta']").length;
            showPossibleMoves();
        }
    }
    function computerMove() {
        let c = computer.play(game);
        try {
            let m = game.move(Player.PLAYER1, c);
            resetBoard();
            changeMessage(m);
        } catch (ex) {
            setMessage(ex.message);
        }
    }
    function play() {
        let coords = coordinates(this);
        try {
            let m = game.move(game.getTurn(), coords);
            resetBoard();
            changeMessage(m);
        } catch (ex) {
            setMessage(ex.message);
        }
        setTimeout(computerMove, 2000);
    }
    function play2() {
        let coords = coordinates(this);
        try {
            let m = game.move(game.getTurn(), coords);
            resetBoard();
            changeMessage(m);
        } catch (ex) {
            setMessage(ex.message);
        }
    }
    function showPossibleMoves() {
        let table = document.querySelector("#tabuleiro");
        let moves = game.possibleMoves();
        for (let {coords, num} of moves) {
            if (num > 0) {
                let {x, y} = coords;
                let td = table.rows[x].cells[y];
                td.className = "selecionado";
                td.innerHTML = num;
            }
        }
    }
    function registerEvents() {
        let iRows = document.querySelector("input[name='rows']");
        let iCols = document.querySelector("input[name='cols']");
        let bStart = document.querySelector("input[name='start']");
        iRows.onchange = changeBoardSize;
        iCols.onchange = changeBoardSize;
        bStart.onclick = changeBoardSize;
        computer = new ComputerPlayer(Player.PLAYER1);
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
                    td.onclick = play;
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
        resetBoard();
        changeMessage();
    }
    return {registerEvents};
}
let gui = new GUI();
gui.registerEvents();
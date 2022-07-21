import Reversi from "./Reversi.js";
import ComputerPlayer from "./ComputerPlayer.js";
import CellState from "./CellState.js";
import Player from "./Player.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

class GUI {
    constructor() {
        this.game = null;
        this.computer1 = new ComputerPlayer(Player.PLAYER1);
        this.computer2 = new ComputerPlayer(Player.PLAYER2);
        this.computerWhite = null;
        this.computerBlack = null;
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    setMessage(msg) {
        let message = document.getElementById("message");
        message.innerHTML = msg;
    }
    changeMessage(m) {
        let objs = { DRAW: "Draw!", PLAYER2: "Black's win!", PLAYER1: "White's win!" };
        if (objs[m]) {
            this.setMessage(`Game Over! ${objs[m]}`);
        } else {
            let msgs = { PLAYER1: "White's turn.", PLAYER2: "Black's turn." };
            this.setMessage(msgs[this.game.getTurn()]);
            this.showPossibleMoves();
        }
        let td1 = document.querySelector("fieldset + table tr:nth-child(2) td:nth-child(2)");
        td1.textContent = document.querySelectorAll("#tabuleiro img[src*='White']").length;
        let td2 = document.querySelector("fieldset + table tr:nth-child(3) td:nth-child(2)");
        td2.textContent = document.querySelectorAll("#tabuleiro img[src*='Black']").length;
    }
    computerMove(obj) {
        let coords = obj.play(this.game);
        this.move(coords);
    }
    humanMove(ev) {
        let coords = this.coordinates(ev.target);
        this.move(coords);
    }
    move(coords) {
        try {
            let m = this.game.move(this.game.getTurn(), coords);
            this.resetBoard();
            this.changeMessage(m);
            if (m === Winner.NONE) {
                this.play();
            }
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
    play() {
        setTimeout(() => {
            if (this.game.getTurn() === Player.PLAYER1 && this.computerWhite) {
                this.computerMove(this.computer1);
            } else if (this.game.getTurn() === Player.PLAYER2 && this.computerBlack) {
                this.computerMove(this.computer2);
            }
        }, 100);
    }
    setPlayer(ev) {
        this.updateComputerPlayer(ev.target);
        this.play();
    }
    updateComputerPlayer(elem) {
        let v = parseInt(elem.value);
        if (elem.id === "white") {
            this.computerWhite = (v === 1);
        } else {
            this.computerBlack = (v === 1);
        }
    }
    showPossibleMoves() {
        let table = document.querySelector("#tabuleiro");
        let moves = this.game.possibleMoves();
        for (let { coords, num } of moves) {
            if (num > 0) {
                let { x, y } = coords;
                let td = table.rows[x].cells[y];
                td.className = "selecionado";
                td.innerHTML = num;
            }
        }
    }
    registerEvents() {
        let iRows = document.querySelector("input[name='rows']");
        let iCols = document.querySelector("input[name='cols']");
        let bStart = document.querySelector("input[name='start']");
        iRows.onchange = this.changeBoardSize.bind(this);
        iCols.onchange = this.changeBoardSize.bind(this);
        bStart.onclick = this.changeBoardSize.bind(this);
        this.changeBoardSize();
        let white = document.querySelector("#white");
        let black = document.querySelector("#black");
        white.onchange = this.setPlayer.bind(this);
        black.onchange = this.setPlayer.bind(this);
        this.updateComputerPlayer(white);
        this.updateComputerPlayer(black);
    }
    resetBoard() {
        let board = this.game.getBoard();
        let rows = board.length;
        let cols = board[0].length;
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < rows; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < cols; j++) {
                let td = document.createElement("td");
                td.innerHTML = (board[i][j] === CellState.EMPTY ? "" : (board[i][j] === CellState.PLAYER1 ? '<img src="images/White-Piece.svg" alt="">' : '<img src="images/Black-Piece.svg" alt="">'));
                td.className = "";
                if (board[i][j] === CellState.EMPTY) {
                    td.onclick = this.humanMove.bind(this);
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    changeBoardSize() {
        let iRows = document.querySelector("input[name='rows']");
        let iCols = document.querySelector("input[name='cols']");
        let cols = parseInt(iCols.value);
        let rows = parseInt(iRows.value);
        this.game = new Reversi(rows, cols);
        this.resetBoard();
        this.changeMessage();
        this.play();
    }
}
let gui = new GUI();
gui.registerEvents();
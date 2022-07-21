import Cell from "./Cell.js";

class GUI {
    constructor() {
        this.ws = null;
        this.player = null;
        this.images = { PLAYER1: "White-Piece.svg", PLAYER2: "Black-Piece.svg" };    
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    setMessage(msg) {
        let message = document.getElementById("message");
        message.innerHTML = msg;
    }
    play(event) {
        let cellDestino = event.currentTarget;
        let cell = this.coordinates(cellDestino);
        this.ws.send(JSON.stringify(cell));
    }
    printBoard(matrix) {
        let table = document.querySelector("table");
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                let td = table.rows[i].cells[j];
                td.innerHTML = "";
                td.className = "";
                td.onclick = this.play.bind(this);
                switch (matrix[i][j]) {
                    case "PLAYER1":
                    case "PLAYER2":
                        td.innerHTML = `<img src='images/${this.images[matrix[i][j]]}' alt=''>`;
                        break;
                }
            }
        }
    }
    clearBoard() {
        let cells = document.querySelectorAll("td");
        cells.forEach(td => {
            td.innerHTML = "";
            td.className = "";
            td.onclick = undefined;
        });
    }
    unsetEvents() {
        let cells = document.querySelectorAll("td");
        cells.forEach(td => td.onclick = undefined);
    }
    readData(evt) {
        let data = JSON.parse(evt.data);
        switch (data.type) {
            case "OPEN":
                this.player = data.turn;
                this.setMessage("");
                this.clearBoard();
                let img = document.getElementById("playerPiece");
                img.src = `imagens/${this.images[this.player]}`;
                break;
            case "MESSAGE":
                this.printBoard(data.board);
                this.setMessage(data.turn === this.player ? "Your turn." : "Oponent's turn.");
                break;
            case "ENDGAME":
                this.printBoard(data.board);
                this.setMessage(`Game Over! ${(data.winner === "DRAW") ? "Draw!" : (data.winner === this.player ? "You win!" : "You lose!")}`);
                this.unsetEvents();
                break;
        }
    }
    startGame() {
        if (this.ws === null || this.ws.readyState === WebSocket.CLOSED) {
            this.ws = new WebSocket(`ws://${document.location.host}${document.location.pathname}reversi`);
            this.ws.onmessage = this.readData.bind(this);
        }
    }
    init() {
        let button = document.querySelector("input[type='button']");
        button.onclick = this.startGame.bind(this);
        let tbody = document.querySelector("tbody");
        for (let i = 0; i < 8; i++) {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < 8; j++) {
                let td = document.createElement("td");
                tr.appendChild(td);
            }            
        }
    }
}
let gui = new GUI();
gui.init();

import {Tabuleiro} from "./Tabuleiro.js";
import {Jogador} from "./Jogador.js";

function GUI() {
    var tab, jogador;
    function coordinates(cell) {
        let dc = cell.cellIndex;
        let dr = cell.parentNode.rowIndex;
        return [dr, dc];
    }
    function setMessage(mensagem) {
        let p = document.querySelector("p");
        p.innerHTML = mensagem;
        montarTabela();
        let td1 = document.querySelector("p + table tr:nth-child(2) td:nth-child(2)");
        td1.textContent = tab.qtdDePecas(Tabuleiro.BRANCA);
        let td2 = document.querySelector("p + table tr:nth-child(3) td:nth-child(2)");
        td2.textContent = tab.qtdDePecas(Tabuleiro.PRETA);
        jogadasPossiveis();
    }
    function jogarComputador() {
        let c = jogador.jogar(tab);
        tab.mover(Tabuleiro.BRANCA, c.getX(), c.getY());
        setMessage(tab.getMessage());
    }
    function jogar() {
        let coords = coordinates(this);
        tab.mover(tab.getTurn() === 0 ? Tabuleiro.BRANCA : Tabuleiro.PRETA, coords[0], coords[1]);
        setMessage(tab.getMessage());
        setTimeout(jogarComputador, 2000);
    }
    function jogar2() {
        let coords = coordinates(this);
        tab.mover(tab.getTurn() === 0 ? Tabuleiro.BRANCA : Tabuleiro.PRETA, coords[0], coords[1]);
        setMessage(tab.getMessage());
    }
    function jogadasPossiveis() {
        let player = tab.getTurn() === 0 ? Tabuleiro.BRANCA : Tabuleiro.PRETA;
        let tds = document.querySelectorAll("#tabuleiro td");
        tds.forEach(cell => {
            if (!cell.firstChild) {
                let coords = coordinates(cell);
                let num = tab.mudarPecas(player, coords[0], coords[1]).length;
                if (num > 0) {
                    cell.className = "selecionado";
                    cell.innerHTML = num;
                }
            }
        });
    }
    function montarTabela() {
        let table = document.querySelector("table");
        tab.tabuleiro.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                var cell = table.rows[rowIndex].cells[colIndex];
                cell.innerHTML = (col === 0 ? "" : (col === 1 ? '<img src="imagens/Pedra-Branca.svg" alt="">' : '<img src="imagens/Pedra-Preta.svg" alt="">'));
                cell.className = "";
                if (col === 0) {
                    cell.onclick = jogar2;
                }
            });
        });
    }
    function init() {
        tab = new Tabuleiro();
        jogador = new Jogador(Tabuleiro.BRANCA);
        montarTabela();
        jogadasPossiveis();
    }
    return {init};
}
let gui = new GUI();
gui.init();
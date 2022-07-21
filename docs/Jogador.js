import {Jogada} from "./Jogada.js";
import {Coords} from "./Coords.js";

export class Jogador {

    constructor(player) {
        this.player = player;
    }

    jogar(tab) {
        let jogadas = [];
        tab.tabuleiro.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col === 0) {
                    jogadas.push(new Jogada(new Coords(rowIndex, colIndex), tab.mudarPecas(this.player, rowIndex, colIndex).length));
                } else {
                    jogadas.push(new Jogada(new Coords(rowIndex, colIndex), 0));
                }
            });
        });
        jogadas.sort((a, b) => (a.num > b.num) ? -1 : (a.num < b.num ? 1 : 0));
        let maior = jogadas[0].num;
        if (maior === 0) {
            return null;
        }
        let melhoresJogadas = jogadas.filter((elem) => elem.num === maior);
        let best = melhoresJogadas[Math.floor(Math.random() * melhoresJogadas.length)];
        return best.coords;
    }
}

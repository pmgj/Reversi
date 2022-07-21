import {Jogada} from "./Jogada.js";
import {Cell} from "./Cell.js";
import {CellState} from "./CellState.js";

function Jogador(p) {
    let player = p;

    function jogar(tab) {
        let jogadas = tab.getBoard().flat().map((c, i) => new Jogada(new Cell(Math.floor(i / 8), i % 8), c === CellState.EMPTY ? tab.mudarPecas(player, new Cell(Math.floor(i / 8), i % 8)).length : 0));
        jogadas.sort((a, b) => b.num - a.num);
        let maior = jogadas[0].num;
        if (maior === 0) {
            return null;
        }
        let melhoresJogadas = jogadas.filter(elem => elem.num === maior);
        let best = melhoresJogadas[Math.floor(Math.random() * melhoresJogadas.length)];
        return best.coords;
    }

    return {jogar};
}

export {Jogador};
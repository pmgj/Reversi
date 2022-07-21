import {Cell} from "./Cell.js";
import {CellState} from "./CellState.js";

function ComputerPlayer(p) {
    let player = p;

    function play(tab) {
        let moves = tab.possibleMoves(player);
        moves.sort((a, b) => b.num - a.num);
        let maior = moves[0].num;
        if (maior === 0) {
            return null;
        }
        let bestMoves = moves.filter(elem => elem.num === maior);
        let best = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        return best.coords;
    }

    return {play};
}

export {ComputerPlayer};
export default class ComputerPlayer {
    constructor(p) {
        this.player = p;
    }
    play(game) {
        let moves = game.possibleMoves(this.player);
        moves.sort((a, b) => b.num - a.num);
        let maior = moves[0].num;
        if (maior === 0) {
            return null;
        }
        let bestMoves = moves.filter(elem => elem.num === maior);
        let best = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        return best.coords;
    }
    getPlayer() {
        return this.player;
    }
}
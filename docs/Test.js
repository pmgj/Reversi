import {Player} from "./Player.js";
import {Reversi} from "./Reversi.js";
import {ComputerPlayer} from "./ComputerPlayer.js";
import {Winner} from "./Winner.js";

let game = new Reversi(8, 8);
let b = new ComputerPlayer(Player.PLAYER1);
let p = new ComputerPlayer(Player.PLAYER2);
let c, ok = true, m;
let objs = {DRAW: "Draw!", PLAYER2: "Black's win!", PLAYER1: "White's win!"};
while (ok) {
    c = p.play(game);
    if (c) {
        m = game.move(Player.PLAYER2, c);
        if (m !== Winner.NONE) {
            break;
        }
    } else {
        ok = false;
    }
    c = b.play(game);
    if (c) {
        m = game.move(Player.PLAYER1, c);
        if (m !== Winner.NONE) {
            break;
        }
        ok = true;
    } else {
        ok = ok || false;
    }
}
console.table(game.getBoard());
console.log(objs[m]);

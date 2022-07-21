import {Player} from "./Player.js";
import {Reversi} from "./Reversi.js";
import {Jogador} from "./Jogador.js";

let tab = new Reversi(8, 8);
let b = new Jogador(Player.PLAYER1);
let p = new Jogador(Player.PLAYER2);
let c, ok = true;
while (ok) {
    c = p.jogar(tab);
    if (c) {
        tab.mover(Player.PLAYER2, c);
        ok = true;
    } else {
        ok = false;
    }
    c = b.jogar(tab);
    if (c) {
        tab.mover(Player.PLAYER1, c);
        ok = true;
    } else {
        ok = ok || false;
    }
}
console.table(tab.getBoard());
console.log(tab.getMessage());

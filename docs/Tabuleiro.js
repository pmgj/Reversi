import {Coords} from "./Coords.js";
import {Jogador} from "./Jogador.js";

export class Tabuleiro {

    constructor() {
        this.turn = 1;
        this.tabuleiro = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]];
        this.mensagem = "";
    }

    static get VAZIA() {
        return 0;
    }

    static get BRANCA() {
        return 1;
    }

    static get PRETA() {
        return 2;
    }

    mudarVez() {
        this.turn = (this.turn + 1) % 2;
    }

    getTurn() {
        return this.turn;
    }

    qtdDePecas(peca) {
        return this.tabuleiro.flat().reduce((a, b) => a + (b === peca ? 1 : 0), 0);
    }

    casasPossiveis(player) {
        let that = this;
        return this.tabuleiro.reduce((acc, cur, rowIndex) =>
            acc + cur.reduce((acc2, cur2, colIndex) =>
                acc2 + ((cur2 === 0) ? that.mudarPecas(player, rowIndex, colIndex).length : 0)
            , 0)
        , 0);
    }

    testarJogada(player, x, y) {
        /* Não é a sua vez de jogar? */
        if ((player === Tabuleiro.PRETA && this.turn === 0) || (player === Tabuleiro.BRANCA && this.turn === 1)) {
            return false;
        }
        /* Célula não está no tabuleiro? */
        if (!this.posicaoValida(x, y)) {
            return false;
        }
        /* Célula não está vazia? */
        if (this.tabuleiro[x][y] !== Tabuleiro.VAZIA) {
            return false;
        }
        /* Célula não muda peças do adversário? */
        if (this.mudarPecas(player, x, y).length === 0) {
            return false;
        }
        return true;
    }

    mudarPecas(player, x, y) {
        let ok = [];
        /* Pode jogar nesta célula? */
        /* Baixo */
        ok.push(this.oneDirection(player, x, y, 0, 1));
        /* Direita */
        ok.push(this.oneDirection(player, x, y, 1, 0));
        /* Esquerda */
        ok.push(this.oneDirection(player, x, y, -1, 0));
        /* Acima */
        ok.push(this.oneDirection(player, x, y, 0, -1));
        /* Noroeste */
        ok.push(this.oneDirection(player, x, y, -1, -1));
        /* Sudeste */
        ok.push(this.oneDirection(player, x, y, 1, 1));
        /* Sudoeste */
        ok.push(this.oneDirection(player, x, y, -1, 1));
        /* Nordeste */
        ok.push(this.oneDirection(player, x, y, 1, -1));
        return ok.flat();
    }

    executarJogada(player, x, y) {
        let coords = this.mudarPecas(player, x, y);
        if (coords.length > 0) {
            coords.push(new Coords(x, y));
            coords.forEach((c) => {
                this.tabuleiro[c.getX()][c.getY()] = player;
            });
        }
    }

    mover(player, x, y) {
        if (this.testarJogada(player, x, y)) {
            this.executarJogada(player, x, y);
            this.posJogada();
        }
    }

    setMessage(msg) {
        this.mensagem = msg;
    }

    getMessage() {
        return this.mensagem;
    }

    posJogada() {
        if (this.qtdDePecas(Tabuleiro.VAZIA) === 0 || (this.casasPossiveis(Tabuleiro.BRANCA) === 0 && this.casasPossiveis(Tabuleiro.PRETA) === 0)) {
            if (this.qtdDePecas(Tabuleiro.BRANCA) > this.qtdDePecas(Tabuleiro.PRETA)) {
                this.setMessage("As brancas venceram.");
            } else if (this.qtdDePecas(Tabuleiro.BRANCA) < this.qtdDePecas(Tabuleiro.PRETA)) {
                this.setMessage("As pretas venceram.");
            } else {
                this.setMessage("Empate.");
            }
        } else {
            if (this.getTurn() === 0) {
                if (this.casasPossiveis(Tabuleiro.PRETA) === 0) {
                    this.setMessage("Brancas jogam novamente.");
                } else {
                    this.mudarVez();
                    this.setMessage("Pretas jogam.");
                }
            } else {
                if (this.casasPossiveis(Tabuleiro.BRANCA) === 0) {
                    this.setMessage("Pretas jogam novamente.");
                } else {
                    this.mudarVez();
                    this.setMessage("Brancas jogam.");
                }
            }
        }
    }

    posicaoValida(x, y) {
        return (x >= 0 && x < 8 && y >= 0 && y < 8);
    }

    oneDirection(player, x, y, h, v) {
        let row, col, coords = [];
        for (row = x + v, col = y + h; this.posicaoValida(row, col); row += v, col += h) {
            if (this.tabuleiro[row][col] === player) {
                break;
            } else if (this.tabuleiro[row][col] === 0) {
                coords = [];
                break;
            } else {
                coords.push(new Coords(row, col));
            }
        }
        return this.posicaoValida(row, col) ? coords : [];
    }

    static main() {
        let tab = new Tabuleiro();
        let b = new Jogador(Tabuleiro.BRANCA);
        let p = new Jogador(Tabuleiro.PRETA);
        let c, ok = true;
        while (ok) {
            c = p.jogar(tab);
            if (c) {
                tab.mover(Tabuleiro.PRETA, c.getX(), c.getY());
                ok = true;
            } else {
                ok = false;
            }
            c = b.jogar(tab);
            if (c) {
                tab.mover(Tabuleiro.BRANCA, c.getX(), c.getY());
                ok = true;
            } else {
                ok = ok || false;
            }
        }
        console.table(tab.tabuleiro);
        console.log(tab.getMessage());
    }
}

Tabuleiro.main();

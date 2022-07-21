export class Jogada {

    constructor(coords, num) {
        this.coords = coords;
        this.num = num;
    }

    toString() {
        return `${this.coords} : ${this.num}`;
    }
}

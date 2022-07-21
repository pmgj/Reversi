export class Cell {
    constructor(row, col) {
        this.x = row;
        this.y = col;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    equals(cell) {
        return (cell.x === this.x && cell.y === this.y);
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
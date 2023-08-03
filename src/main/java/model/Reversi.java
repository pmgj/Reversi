package model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

public class Reversi {

    private final int rows;
    private final int cols;
    private Player turn = Player.PLAYER2;
    private final CellState[][] board;

    public Reversi(int nrows, int ncols) {
        this.rows = nrows;
        this.cols = ncols;
        this.board = this.startBoard();
    }

    private CellState[][] startBoard() {
        CellState[][] matrix = new CellState[rows][cols];
        for (CellState[] row : matrix) {
            Arrays.fill(row, CellState.EMPTY);
        }
        matrix[rows / 2 - 1][cols / 2 - 1] = CellState.PLAYER2;
        matrix[rows / 2][cols / 2] = CellState.PLAYER2;
        matrix[rows / 2][cols / 2 - 1] = CellState.PLAYER1;
        matrix[rows / 2 - 1][cols / 2] = CellState.PLAYER1;
        return matrix;
    }

    public long countPieces(CellState piece) {
        Stream<CellState> stream = Arrays.stream(board).flatMap(x -> Arrays.stream(x));
        return stream.filter(c -> c == piece).count();
    }

    public Winner move(Player player, Cell endCell) {
        if (player != turn) {
            throw new IllegalArgumentException("It's not your turn.");
        }
        if (!isValidCell(endCell)) {
            throw new IllegalArgumentException("Cell is not on board.");
        }
        if (board[endCell.x()][endCell.y()] != CellState.EMPTY) {
            throw new IllegalArgumentException("Cell is not not empty.");
        }
        int[][] directions = {{0, 1}, {1, 0}, {-1, 0}, {0, -1}, {-1, -1}, {1, 1}, {-1, 1}, {1, -1}};
        boolean ok = false;
        for (int[] direction : directions) {
            ok = oneDirection(player, endCell, direction[0], direction[1]) || ok;
        }
        if (ok) {
            turn = turn == Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
            return isGameOver();
        } else {
            return Winner.NONE;
        }
    }

    private Winner isGameOver() {
        if (countPieces(CellState.EMPTY) == 0) {
            long p1 = countPieces(CellState.PLAYER1);
            long p2 = countPieces(CellState.PLAYER2);
            if(p1 > p2) {
                return Winner.PLAYER1;
            } else if(p1 < p2) {
                return Winner.PLAYER2;
            } else {
                return Winner.DRAW;
            }
        }
        return Winner.NONE;
    }

    private boolean oneDirection(Player player, Cell cell, int h, int v) {
        boolean ok = false;
        int row = cell.x() + v, col = cell.y() + h;
        List<Cell> coords = new ArrayList<>();
        while (isValidCell(new Cell(row, col))) {
            if ((board[row][col] == CellState.PLAYER1 && player == Player.PLAYER1)
                    || (board[row][col] == CellState.PLAYER2 && player == Player.PLAYER2)) {
                break;
            } else if (board[row][col] == CellState.EMPTY) {
                coords.clear();
                break;
            } else {
                coords.add(new Cell(row, col));
            }
            row += v;
            col += h;
        }
        if (isValidCell(new Cell(row, col)) && !coords.isEmpty()) {
            ok = true;
            coords.add(cell);
            coords.forEach(c -> board[c.x()][c.y()] = (player == Player.PLAYER1) ? CellState.PLAYER1 : CellState.PLAYER2);
        }
        return ok;
    }

    private boolean isValidCell(Cell cell) {
        return (cell.x() < rows && cell.x() >= 0 && cell.y() < cols && cell.y() >= 0);
    }

    public Player getTurn() {
        return turn;
    }

    public CellState[][] getBoard() {
        return board;
    }
}

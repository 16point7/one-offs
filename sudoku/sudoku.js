function Sudoku() {

};

Sudoku.solve = function(board) {
    Sudoku.s(board, -1);
};

Sudoku.s = function(board, prev) {
    let next = Sudoku.findNext(board, prev);

    if (next >= board.length) {
        return true;
    }

    for (let i = 1; i <= 9; ++i) {
        if (Sudoku.validMove(board, next, i)) {
            board[next] = i;
            if (Sudoku.s(board, next)) {
                return true;
            }
            board[next] = 0;
        }
    }

    return false;
};

Sudoku.findNext = function(board, prev) {
    do {
        ++prev;
    } while (prev < board.length && board[prev] != 0);
    return prev;
};

Sudoku.validMove = function(board, idx, num) {
    // check row
    for (let i = ((idx/9)|0)*9, end = i+9; i < end; ++i) {
        if (board[i] == num) {
            return false;
        }
    }

    // check col
    for (let j = idx%9; j < board.length; j+=9) {
        if (board[j] == num) {
            return false;
        }
    }

    // check square
    for (let j = ((((idx/9)|0)/3)|0)*3, endJ = j+3; j < endJ; ++j) {
        for (let i = (((idx%9)/3)|0)*3, endI = i+3; i < endI; ++i) {
            if (board[j*9+i] == num) {
                return false;
            }
        }
    }

    return true;    
};
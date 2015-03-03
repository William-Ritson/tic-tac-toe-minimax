var _ = require('lodash');

var ai = {};

var evaluateState = function (board) {
    var lines = [
        // Horizontal
        board[0][0] + board[0][1] + board[0][2],
        board[1][0] + board[1][1] + board[1][2],
        board[2][0] + board[2][1] + board[2][2],
        // Vertical
        board[0][0] + board[1][0] + board[2][0],
        board[0][1] + board[1][1] + board[2][1],
        board[0][2] + board[1][2] + board[2][2],
         // Diaginal
        board[0][0] + board[1][1] + board[2][2],
        board[2][0] + board[1][1] + board[0][2]
    ];

    for (var i = 0; i < lines.length; i += 1) {
        if (lines[i] === 3) {
            return 1;
        } else if (lines[i] === -3) {
            return -1;
        }
    }

    for (i = 0; i < 3; i += 1) {
        for (j = 0; j < 3; j += 1) {
            if (board[i][j] === 0) {
                return undefined;
            }
        }
    }

    return 0;
};


var getAvalibleMoves = function (board) {
    var moves = [],
        i, j;

    for (i = 0; i < 3; i += 1) {
        for (j = 0; j < 3; j += 1) {
            if (board[i][j] === 0) {
                moves.push([i, j]);
            }
        }
    }

    return moves;
};

var isTerminal = function (state) {
    return evaluateState(state) !== undefined;
};

var minimax = function (turn, state, move) {
    var nextState = _.clone(state, true);
    if (move) {
        nextState[move[0]][move[1]] = turn;
    }
    
    if (isTerminal(nextState)) {
        return evaluateState(nextState);   
    }
    
    var choices = getAvalibleMoves(nextState);
    
    if (turn == 1) {
        return Math.min.apply(null, choices.map(_.partial(minimax, -turn, nextState)));
    } else {
        return Math.max.apply(null, choices.map(_.partial(minimax, -turn, nextState)));
    }
};

ai.selectMove = function (board) {
    var choices = getAvalibleMoves(board),
        bestChoice,
        bestChoiceValue = Infinity;

    for (var i = 0; i < choices.length; i += 1) {
        value = minimax(-1, board, choices[i]);
        if (value < bestChoiceValue) {
            bestChoiceValue = value;
            bestChoice = choices[i];
        }
    }
        
    return bestChoice;
};


module.exports = ai;
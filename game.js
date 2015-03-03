var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var ai = require('./ai.js');

var game = {};

game.board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

game.printBoard = function () {
    var i, j,
        symbols = ['O', '_', 'X'],
        out = '';

    for (i = 0; i < this.board.length; i += 1) {
        for (j = 0; j < this.board.length; j += 1) {
            out += symbols[this.board[i][j] + 1] + ' ';
        }
        out += '\n';
    }
    console.log('\033[2J');
    console.log(out);
};

game.makeMove = function (player, x, y) {
    if (this.board[x][y] !== 0) {
        throw new Error('Move taken');
    }
    this.board[x][y] = player;
    this.printBoard();
};

game.start = function () {
    game.printBoard();
    game.playerTurn();
};

game.playerTurn = function () {
    rl.question('Enter  move x y: ', function (cordinateString) {
        var madeMove = false;
        try {
            var cordinate = cordinateString.split(/\s/);
            game.makeMove(1, parseInt(cordinate[1] - 1), parseInt(cordinate[0] - 1));
            madeMove = true;
        } catch (e) {
            console.log('invalid move', e);
            game.playerTurn();
        }
        if (madeMove) {
            if (!game.isOver()) {
                game.aiTurn();
            }
        } else {
            game.playerTurn();
        }
    });
};

game.aiTurn = function () {
    var turnMade = false;
    move = ai.selectMove(this.board);

    game.makeMove(-1, move[0], move[1]);

    if (!game.isOver()) {
        game.playerTurn();
    }
};

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

game.isOver = function () {
    var res = evaluateState(this.board);
    game.printBoard();
    if (res === 0) {
        console.log('Draw');
    } else if (res === 1) {
        console.log('Player Win');
    } else if (res === -1) {
        console.log('A.I Win');
    } else {
        return false;
    }
    game.end();
    return true;
};

game.end = function () {
    rl.close();
};

game.start();
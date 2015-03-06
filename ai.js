var _ = require('lodash');

var ai = function (evaluator, enumerator, applier) {
    this.evaluate = evaluator;
    this.enumerate = enumerator;
    this.apply = applier;
};


ai.prototype.isTerminal = function (state) {
    return this.evaluate(state) !== undefined;
};



/*
Wikipedia Pseudocode
01 function alphabeta(node, depth, α, β, maximizingPlayer)
02      if depth = 0 or node is a terminal node
03          return the heuristic value of node
04      if maximizingPlayer
05          v := -∞
06          for each child of node
07              v := max(v, alphabeta(child, depth - 1, α, β, FALSE))
08              α := max(α, v)
09              if β ≤ α
10                  break (* β cut-off *)
11          return v
12      else
13          v := ∞
14          for each child of node
15              v := min(v, alphabeta(child, depth - 1, α, β, TRUE))
16              β := min(β, v)
17              if β ≤ α
18                  break (* α cut-off *)
19          return v

(* Initial call *)
alphabeta(origin, depth, -∞, +∞, TRUE)
*/

var countAB = 0;
ai.prototype.alphaBeta = function (turn, state, move, alpha, beta) {
    countAB++;
    state = _.clone(state, true);
    
    this.apply(move, state, turn);
    
    if (this.isTerminal(state)) {
        return this.evaluate(state);
    }

    var nextPlayerTurn = -turn,
        choices = this.enumerate(state),
        value, i;
    
    if (nextPlayerTurn === 1) { // The next player will be the maximizer (the ai)
        value = -Infinity;
        for (i = 0; i < choices.length; i += 1) {
            value = Math.max(value, this.alphaBeta(nextPlayerTurn, state, choices[i], alpha, beta));
            alpha = Math.max(alpha, value);
            if (beta <= alpha) {
                break;
            }
        }
    } else { // The next player will be the minimizer (the human) 
        value = Infinity;
        for (i = 0; i < choices.length; i += 1) {
            value = Math.min(value, this.alphaBeta(nextPlayerTurn, state, choices[i], alpha, beta));
            beta = Math.min(beta, value);
            if (beta <= alpha) {
                break;
            }
        }
    }
    
    return value;

};

var countMM = 0;
ai.prototype.minimax = function (turn, state, move) {
    countMM++;
    state = _.clone(state, true);
    
    this.apply(move, state, turn);
    
    if (this.isTerminal(state)) {
        return this.evaluate(state);
    }

    var nextPlayerTurn = -turn;
    
    var choices = this.enumerate(state);

    if (nextPlayerTurn === 1) { // The next player will be the maximizer (the ai)
        return Math.max.apply(null, choices.map(_.bind(this.minimax, this, nextPlayerTurn, state)));
    } else { // The next player will be the minimizer (the human) 
        return Math.min.apply(null, choices.map(_.bind(this.minimax, this, nextPlayerTurn, state)));
    }
};

ai.prototype.selectMove = function (state) {
    var choices = this.enumerate(state),
        value,
        bestChoice,
        bestChoiceValue = -Infinity;

    for (var i = 0; i < choices.length; i += 1) {
        value = this.alphaBeta(1, state, choices[i], -Infinity, Infinity);
        console.log(value === this.minimax(1, state, choices[i]));
        console.log(choices[i], value);
        if (value > bestChoiceValue) {
            bestChoiceValue = value;
            bestChoice = choices[i];
        }
    }
    console.log(countAB, countMM);

    return bestChoice;
};


module.exports = ai;
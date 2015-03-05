var _ = require('lodash');

var ai = function (evaluator, enumerator, applier) {
    this.evaluate = evaluator;
    this.enumerate = enumerator;
    this.apply = applier;
};


ai.prototype.isTerminal = function (state) {
    return this.evaluate(state) !== undefined;
};


ai.prototype.minimax = function (turn, state, move) {
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
        bestChoice,
        bestChoiceValue = -Infinity;

    for (var i = 0; i < choices.length; i += 1) {
        value = this.minimax(1, state, choices[i]);
        if (value > bestChoiceValue) {
            bestChoiceValue = value;
            bestChoice = choices[i];
        }
    }

    return bestChoice;
};


module.exports = ai;
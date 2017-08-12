'use strict';

var round;
if (typeof require !== 'undefined') {
	round = require('./round.js');
} else {
	round = {Round: Round};
}

class Game {
	// team1 is the array of player names for team 1
	// team2 is the array of player names for team 2
	constructor(team1, team2) {
		this.team1_ = team1;
		this.team2_ = team2;
		this.rounds_ = [];
		this.score1_ = 0;
		this.score2_ = 0;
		//var r = new round.Round([1,2], [3,4]);
	}

	start_round(bids1, bids2) {
		// TODO make a round, and push it to this.rounds_
	}

	finish_round(tricks1, tricks2) {
		// TODO:
		// Get current sandbags
		// this.rounds_[<last>].finish_round
	}

	get score1() { return this.score1_; }
	get score2() { return this.score1_; }
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports.Game = Game;
}

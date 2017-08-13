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
		this.score_ = [0, 0];
		this.sandbags_ = [0, 0,];
		this.current_round_ = null;
	}

	start_round(bids1, bids2) {
		this.current_round_ = new round.Round(bids1, bids2);
	}

	finish_round(tricks1, tricks2) {
		this.current_round_.finish_round(tricks1, tricks2, this.sandbags_[0], this.sandbags_[1]);
		this.score_[0] += this.current_round_.score(0);
		this.score_[1] += this.current_round_.score(1);
		this.sandbags_ = this.current_round_.next_sandbags(this.sandbags_);
		this.rounds_.push(this.current_round_);
		this.current_round_ = null;
	}

	serialize() {
		localStorage.setItem('game', JSON.stringify(this));
	}

	static deserialize() {
		var d = JSON.parse(localStorage.getItem('game'));
		var g = new Game(d.team1_, d.team2_);
		g.score_ = d.score_;
		for (var i = 0; i < d.rounds_.length; ++i) {
			g.rounds_.push(round.Round.deserialize(d.rounds_[i]));
		}
		g.sandbags_ = d.sandbags_;
		return g;
	}

	score(i) { return this.score_[i]; }
	sandbags(i) { return this.sandbags_[i]; }
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports.Game = Game;
}

'use strict';

class Round {
	// bid1 {array<int>} the bids for team1
	// bid2 {array<int>} the bids for team2
	constructor(bid1, bid2) {
		this.bid1_ = bid1;
		this.bid2_ = bid2;
		this.delta_ = [0, 0];
		this.sandbags_ = [0, 0];
	}

	// team {int} team to get score of
	score(team) {
		return this.delta_[team];
	}

	// team {int} team to get sandbags of
	sandbags(team) {
		return this.sandbags_[team];
	}

	get bid1() { return this.bid1_; }
	get bid2() { return this.bid2_; }
	get tricks1() { return this.tricks1_; }
	get tricks2() { return this.tricks2_; }

	static sandbags(bids, tricks) {
		var s = 0;
		for (var i = 0; i < bids.length; ++i) {
			if (bids[i] == 0) {
				s += tricks[i];
				continue;
			}
			s += Math.max(tricks[i] - bids[i], 0);
		}
		return s
	}

	static calc_score(bids, tricks, sandbag_penalty) {
		var s = 0, total_bids = 0, total_tricks = 0;
		for (var i = 0; i < bids.length; ++i) {
			if (bids[i] == 0) {
				s += tricks[i] == 0 ? 100 : -100;
				continue;
			}
			total_bids += bids[i];
			total_tricks += tricks[i];
		}
		if (total_tricks >= total_bids) {
			s += 10 * total_bids + (total_tricks - total_bids);
		} else {
			s += -10 * total_bids;
		}
		return sandbag_penalty + s;
	}

	// tricksX {array<int>} taken tricks for team X
	// curr_sandbagsX {int} current sandbags for team X
	finish_round(tricks1, tricks2, curr_sandbags1, curr_sandbags2) {
		var total = 0;
		for (var i = 0; i < tricks1.length; ++i) {
			total += tricks1[i];
		}
		for (var i = 0; i < tricks2.length; ++i) {
			total += tricks2[i];
		}
		if (total != 13) {
			throw 'Invalid tricks taken: ' + total
		}
		this.tricks1_ = tricks1;
		this.tricks2_ = tricks2;
		this.sandbags_[0] = Round.sandbags(this.bid1_, tricks1);
		this.sandbags_[1] = Round.sandbags(this.bid2_, tricks2);
		var sandbag_penalty = 0;
		if (this.sandbags_[0] + curr_sandbags1 >= 10) {
			sandbag_penalty = -100;
		}
		this.delta_[0] = Round.calc_score(this.bid1_, tricks1, sandbag_penalty);
		sandbag_penalty = 0;
		if (this.sandbags_[1] + curr_sandbags2 >= 10) {
			sandbag_penalty = -100;
		}
		this.delta_[1] = Round.calc_score(this.bid2_, tricks2, sandbag_penalty);
	}

	next_sandbags(curr_sandbags) {
		return [(this.sandbags_[0] + curr_sandbags[0]) % 10, (this.sandbags_[1] + curr_sandbags[1]) % 10];
	}

	serialize() {
		return JSON.stringify(this);
	}

	// d {object} the json of the round
	static deserialize(d) {
		var r = new Round(d.bid1_, d.bid2_);
		r.delta_ = d.delta_;
		r.sandbags_ = d.sandbags_;
		r.tricks1_ = d.tricks1_;
		r.tricks2_ = d.tricks2_;
		return r;
	}
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports.Round = Round;
}

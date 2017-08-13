var round = require('./round.js')
var sink = require('sink')
var start = sink.start
sink = sink.sink

sink('round', function(test, ok, before, after, assert) {
	test('get_bid', function(complete) {
		var r = new round.Round([1, 2], [5, 5]);
		r.finish_round([1, 2], [5, 5], 0, 0);
		assert.equal(r.score(0), 30, 'score 0');
		assert.equal(r.sandbags(0), 0, 'sandbags 0');
		assert.equal(r.score(1), 100, 'score 1');
		assert.equal(r.sandbags(1), 0, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([0, 0]), [0, 0], 'next sandbags');
		complete();
	});

	test('sandbag_bid', function(complete) {
		var r = new round.Round([1, 2], [3, 4]);
		r.finish_round([2, 3], [3, 5], 0, 0);
		assert.equal(r.score(0), 32, 'score 0');
		assert.equal(r.sandbags(0), 2, 'sandbags 0');
		assert.equal(r.score(1), 71, 'score 1');
		assert.equal(r.sandbags(1), 1, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([0, 0]), [2, 1], 'next sandbags');
		complete();
	});

	test('miss_bid', function(complete) {
		var r = new round.Round([1, 2], [3, 9]);
		r.finish_round([1, 1], [3, 8], 0, 0);
		assert.equal(r.score(0), -30, 'score 0');
		assert.equal(r.sandbags(0), 0, 'sandbags 0');
		assert.equal(r.score(1), -120, 'score 1');
		assert.equal(r.sandbags(1), 0, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([0, 0]), [0, 0], 'next sandbags');
		complete();
	});

	test('nil_bid', function(complete) {
		var r = new round.Round([1, 0], [3, 9]);
		r.finish_round([1, 0], [3, 9], 0, 0);
		assert.equal(r.score(0), 110, 'score 0');
		assert.equal(r.sandbags(0), 0, 'sandbags 0');
		assert.equal(r.score(1), 120, 'score 1');
		assert.equal(r.sandbags(1), 0, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([0, 0]), [0, 0], 'next sandbags');
		complete();
	});

	test('double_nil_bid', function(complete) {
		var r = new round.Round([0, 0], [3, 9]);
		r.finish_round([0, 0], [4, 9], 0, 0);
		assert.equal(r.score(0), 200, 'score 0');
		assert.equal(r.sandbags(0), 0, 'sandbags 0');
		assert.equal(r.score(1), 121, 'score 1');
		assert.equal(r.sandbags(1), 1, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([0, 0]), [0, 1], 'next sandbags');
		complete();
	});

	test('miss_nil_bid', function(complete) {
		var r = new round.Round([1, 0], [3, 8]);
		r.finish_round([1, 1], [3, 8], 0, 0);
		assert.equal(r.score(0), -90, 'score 0');
		assert.equal(r.sandbags(0), 1, 'sandbags 0');
		assert.equal(r.score(1), 110, 'score 1');
		assert.equal(r.sandbags(1), 0, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([0, 0]), [1, 0], 'next sandbags');
		complete();
	});

	test('miss_double_nil_bid', function(complete) {
		var r = new round.Round([0, 0], [3, 8]);
		r.finish_round([1, 1], [3, 8], 0, 0);
		assert.equal(r.score(0), -200, 'score 0');
		assert.equal(r.sandbags(0), 2, 'sandbags 0');
		assert.equal(r.score(1), 110, 'score 1');
		assert.equal(r.sandbags(1), 0, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([0, 0]), [2, 0], 'next sandbags');
		complete();
	});

	test('sandbog_penalty', function(complete) {
		var r = new round.Round([1, 1], [3, 6]);
		r.finish_round([1, 2], [3, 7], 9, 0);
		assert.equal(r.score(0), -79, 'score 0');
		assert.equal(r.sandbags(0), 1, 'sandbags 0');
		assert.equal(r.score(1), 91, 'score 1');
		assert.equal(r.sandbags(1), 1, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([9, 0]), [0, 1], 'next sandbags');
		complete();
	});

	test('sandbog_penalty_>10', function(complete) {
		var r = new round.Round([1, 1], [3, 5]);
		r.finish_round([2, 2], [3, 6], 9, 0);
		assert.equal(r.score(0), -78, 'score 0');
		assert.equal(r.sandbags(0), 2, 'sandbags 0');
		assert.equal(r.score(1), 81, 'score 1');
		assert.equal(r.sandbags(1), 1, 'sandbags 1');
		assert.deepEqual(r.next_sandbags([9, 0]), [1, 1], 'next sandbags');
		complete();
	});

	test('serialize', function(complete) {
		var r = new round.Round([1, 1], [3, 5]);
		r.finish_round([2, 2], [3, 6], 0, 0);
		assert.equal(r.score(0), 22, 'score 0');
		assert.equal(r.sandbags(0), 2, 'sandbags 0');
		assert.equal(r.score(1), 81, 'score 1');
		assert.equal(r.sandbags(1), 1, 'sandbags 1');
		assert.equal(r.serialize(), '{"bid1_":[1,1],"bid2_":[3,5],"delta_":[22,81],"sandbags_":[2,1],"tricks1_":[2,2],"tricks2_":[3,6]}', 'serialize');
		complete();
	});

	test('deserialize', function(complete) {
		var r = round.Round.deserialize('{"bid1_":[1,1],"bid2_":[3,5],"delta_":[22,81],"sandbags_":[2,1],"tricks1_":[2,2],"tricks2_":[3,6]}');
		assert.equal(r.score(0), 22, 'score 0');
		assert.equal(r.sandbags(0), 2, 'sandbags 0');
		assert.equal(r.score(1), 81, 'score 1');
		assert.equal(r.sandbags(1), 1, 'sandbags 1');
		assert.deepEqual(r.tricks1, [2, 2], 'tricks 1');
		assert.deepEqual(r.tricks2, [3, 6], 'tricks 2');
		complete();
	});
});

start();

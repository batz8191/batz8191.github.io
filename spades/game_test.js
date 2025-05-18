var game = require('./game.js')
var sink = require('sink')
var start = sink.start
sink = sink.sink

sink('game', function(test, ok, before, after, assert) {
	test('basic_round', function(complete) {
		var g = new game.Game(['a', 'b'], ['c', 'd']);
		g.start_round([1, 2], [3, 4]);
		g.finish_round([2, 2], [4, 5]);
		assert.equal(g.score(0), 31, 'score 1');
		assert.equal(g.sandbags(0), 1, 'sandbags 1');
		assert.equal(g.score(1), 72, 'score 2');
		assert.equal(g.sandbags(1), 2, 'sandbags 2');
		complete();
	});

	test('multiple_round', function(complete) {
		var g = new game.Game(['a', 'b'], ['c', 'd']);
		// Round 1
		g.start_round([1, 2], [3, 4]);
		g.finish_round([2, 2], [4, 5]);
		assert.equal(g.score(0), 31, 'round 1 score 1');
		assert.equal(g.sandbags(0), 1, 'round 1 sandbags 1');
		assert.equal(g.score(1), 72, 'round 1 score 2');
		assert.equal(g.sandbags(1), 2, 'round 1 sandbags 2');
		// Round 2
		g.start_round([1, 2], [3, 4]);
		g.finish_round([2, 2], [4, 5]);
		assert.equal(g.score(0), 62, 'round 2 score 1');
		assert.equal(g.sandbags(0), 2, 'round 2 sandbags 1');
		assert.equal(g.score(1), 144, 'round 2 score 2');
		assert.equal(g.sandbags(1), 4, 'round 2 sandbags 2');
		console.log('g: ' + JSON.stringify(g));
		complete();
	});

	test('multiple_round_sandbags', function(complete) {
		var g = new game.Game(['a', 'b'], ['c', 'd']);
		// Round 1
		g.start_round([1, 1], [1, 1]);
		g.finish_round([8, 2], [1, 2]);
		assert.equal(g.score(0), 28, 'round 1 score 1');
		assert.equal(g.sandbags(0), 8, 'round 1 sandbags 1');
		assert.equal(g.score(1), 21, 'round 1 score 2');
		assert.equal(g.sandbags(1), 1, 'round 1 sandbags 2');
		// Round 2
		g.start_round([1, 1], [1, 1]);
		g.finish_round([9, 2], [1, 1]);
		assert.equal(g.score(0), -43, 'round 2 score 1');
		assert.equal(g.sandbags(0), 7, 'round 2 sandbags 1');
		assert.equal(g.score(1), 41, 'round 2 score 2');
		assert.equal(g.sandbags(1), 1, 'round 2 sandbags 2');
		complete();
	});
});

start();

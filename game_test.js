var game = require('./game.js')
var sink = require('sink')
var start = sink.start
sink = sink.sink

sink('game', function(test, ok, before, after, assert) {
	test('get_bid', function(complete) {
		var g = new game.Game(['a', 'b'], ['c', 'd']);
		console.log('Game: ' + JSON.stringify(g));
		assert.equal(1, 1, 'score 0');
		complete();
	});
});

start();

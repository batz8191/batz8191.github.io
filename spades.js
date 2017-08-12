'use strict';

function init() {
	console.log('init');
	var r = new Round([1,2], [3,4]);
	console.log('round: ' + JSON.stringify(r));
	var g = new Game(['a', 'b'], ['c', 'd']);
	console.log('game: ' + JSON.stringify(g));
	//var x = document.getElementById('new_game');
	//x.onclick = show_create_game;
	create_player_table(['player 1', 'player 2', 'player 3', 'player 4']);
}

function show_create_game() {
	console.log('show_create_game');
	var x = document.getElementById('new_game');
	var n = document.getElementById('new_game_div');
	var c = document.getElementById('create');
	// TODO set focus to create_player1
	c.onclick = create_game;
	n.style.display = 'block';
	x.style.display = 'none';
}

function create_game() {
	console.log('create_game');
	var d = document.getElementById('new_game_div');
	var players = validate_player_names('create_player');
	if (players.length != 4) {
		console.log('Wrong player count: ' + players.length + ' ' + JSON.stringify(players));
		return;
	}
	create_player_table(players);
	d.style.display = 'none';
}

function validate_player_names(prefix) {
	console.log('validate_player_names');
	var e = document.getElementById('new_game_error');
	var players = [];
	var err = 'Error: ';
	for (var i = 1; i <= 4; ++i) {
		var x = document.getElementById(prefix + i).value;
		console.log('validate_player_names: ' + i + ' [' + x + ']');
		if (x == '') {
			err += 'empty name for player ' + i;
			continue;
		}
		players.push(x);
	}
	if (err != 'Error: ') {
		e.appendChild(document.createTextNode(err));
		e.style.display = 'block';
		return [];
	}
	return players;
}

function create_player_table(players) {
	console.log('create_player_table');
	var t = document.createElement('table');
	// TODO add a sandbags column
	t.id = 'scores';
	t.border = 1;
	// Fill in players
	var th = document.createElement('tr');
	th.appendChild(document.createElement('th'));
	for (var i = 0; i < players.length; ++i) {
		var td = document.createElement('th');
		td.appendChild(document.createTextNode(players[i]));
		th.appendChild(td);
	}
	t.appendChild(th);
	// Fill in score row
	var tr = document.createElement('tr');
	tr.id = 'final_scores';
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score'));
	tr.appendChild(td);
	td = document.createElement('td');
	td.id = 'team_1_score';
	td.appendChild(document.createTextNode('0'));
	td.colSpan = 2;
	td.align = 'center';
	tr.appendChild(td);
	td = document.createElement('td');
	td.id = 'team_2_score';
	td.appendChild(document.createTextNode('0'));
	td.colSpan = 2;
	td.align = 'center';
	tr.appendChild(td);
	t.appendChild(tr);
	var x = document.getElementById('scorecard');
	x.appendChild(t);
	var b = document.createElement('button');
	b.id = 'new_round';
	b.appendChild(document.createTextNode('New Round'));
	b.onclick = show_new_round;
	x.appendChild(b);
	b = document.createElement('button');
	b.id = 'finish_round';
	b.appendChild(document.createTextNode('Finish Round'));
	b.onclick = show_finish_round;
	b.style.display = 'none';
	x.appendChild(b);
	x.style.display = 'block';
}

function show_new_round() {
	console.log('show_new_round');
	var d = document.getElementById('new_round_div');
	var b = document.getElementById('finish_bid');
	b.onclick = finish_bid;
	d.style.display = 'block';
}

function finish_bid() {
	console.log('finish_bid');
	if (!validate_bid('create_player' )) {
		return;
	}
	var t = document.getElementById('scores');
	var scores = document.getElementById('final_scores');
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Bid'));
	tr.appendChild(td);
	for (var i = 1; i <= 4; ++i) {
		var p = document.getElementById('bid_player' + i);
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(p.value));
		tr.appendChild(td);
	}
	var b = document.getElementById('new_round');
	b.style.display = 'none';
	b = document.getElementById('finish_round');
	b.style.display = 'block';
	t.insertBefore(tr, scores);
	var d = document.getElementById('new_round_div');
	d.style.display = 'none';
}

function validate_bid(prefix) {
	console.log('validate_bid');
	// TODO
	return true;
}

function show_finish_round() {
	console.log('show_finish_round');
	var d = document.getElementById('finish_round_div');
	var b = document.getElementById('update_score');
	b.onclick = update_score;
	d.style.display = 'block';
}

function update_score() {
	console.log('update_score');
	var d = document.getElementById('finish_round_div');
	var bn = document.getElementById('new_round');
	var bf = document.getElementById('finish_round');
	var tricks = validate_tricks('tricks_player');
	if (tricks.length != 4) {
		return;
	}
	// TODO:
	// Update table with tricks
	// Update score with score
	bn.style.display = 'block';
	bf.style.display = 'none';
	d.style.display = 'none';
}

function validate_tricks(prefix) {
	// TODO
	return [0, 0, 0, 0];
	console.log('validate_tricks');
	// TODO
	return true;
}

window.onload = init;

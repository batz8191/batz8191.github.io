// trimPrefix trims prefx from str
function trimPrefix(str, prefix) {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length);
  }
  return str;
}

// toggleElement toggles the dilpay of a dom element
function toggleElement(id) {
	let a = document.getElementById('available-form');
	if (a.style.display == 'none') {
		a.style.display = 'block';
	} else {
		a.style.display = 'none';
	}
}

// Function to calculate the multiset difference and edit distance
// a, b int
function multisetEditDistance(a, b) {
	diffA = new Map();
	diffB = new Map();
	for (const x of a) {
		diffA.set(x, (diffA.get(x) ?? 0)+1);
	}
	for (const x of b) {
		diffB.set(x, (diffB.get(x) ?? 0)+1);
	}
	let distance = 0
	for (const [value, countA] of diffA) {
		const countB = diffB.get(value) ?? 0;
		if (countA > countB) {
			distance += countA - countB;
		}
	}
	for (const [value, countB] of diffB) {
		const countA = diffA.get(value) ?? 0;
		if (countB > countA) {
			distance += countB - countA;
		}
	}
	return distance;
}

// Function to find all combinations of weights that sum to a target
function findCombinations(target, available, index, currentCombination, seen, allCombinations) {
	if (target == 0) {
		let combination = currentCombination.concat();
		combination.sort((a, b) => b - a);
		let key = combination.join(' ');
		if (!seen.has(key)) {
			allCombinations.push(combination);
			seen.set(key, true);
		}
		return;
	}
	if (target < 0 || index >= available.length) {
		return;
	}
	// Include the current weight (if it doesn't exceed the target)
	if (available[index] <= target) {
		findCombinations(target - available[index], available, index+1, currentCombination.concat(available[index]), seen, allCombinations);
	}
	// Exclude the current weight (move to the next available weight)
	findCombinations(target, available, index+1, currentCombination, seen, allCombinations);
}

function solveWeightMinimization(targets, available) {
	let n = targets.length;
	if (n == 0) {
		return [];
	}
	let combinations = new Array(n);
	for (let i = 0; i < n; i++) {
		let seen = new Map();
		combinations[i] = [];
		findCombinations(targets[i], available, 0, [], seen, combinations[i]);
	}
	// dp[i][j] stores the minimum edit distance to reach the j-th combination of the i-th target
	let dp = new Array(n);
	// path[i][j] stores the index of the optimal combination from the previous target
	let path = new Array(n);
	for (let i = 0; i < n; i++) {
		dp[i] = new Array(combinations[i].length);
		path[i] = new Array(combinations[i].length);
	}
	// Base case: for the first target, the cost to reach any combination is 0
	for (let j = 0; j < dp[0].length; j++) {
		dp[0][j] = 0;
		path[0][j] = -1;
	}
	// Iterate through the targets starting from the second one
	for (let i = 1; i < n; i++) {
		for (let j = 0; j < dp[i].length; j++) {
			let minDistance = -1;
			let bestPrevIndex = -1;
			for (let k = 0; k < dp[i-1].length; k++) {
				let distance = dp[i-1][k] + multisetEditDistance(combinations[i-1][k], combinations[i][j]);
				if (minDistance == -1 || distance < minDistance) {
					minDistance = distance
					bestPrevIndex = k
				}
			}
			dp[i][j] = minDistance
			path[i][j] = bestPrevIndex
		}
	}
	// Find the minimum edit distance in the last row of dp
	minTotalDistance = -1;
	lastIndex = -1;
	for (let j = 0; j < dp[n-1].length; j++) {
		let distance = dp[n-1][j];
		if (minTotalDistance == -1 || distance < minTotalDistance) {
			minTotalDistance = distance
			lastIndex = j;
		}
	}
	// Backtrack to reconstruct the optimal sequence of combinations
	let optimalCombinations = new Array(n);
	let currentIndex = lastIndex
	for (let i = n - 1; i >= 0; i--) {
		optimalCombinations[i] = combinations[i][currentIndex]
		currentIndex = path[i][currentIndex]
	}
	return optimalCombinations
}

// ListMap manages a map (name, value), operating with storage and dom.
class ListMap {
	// constructor:
	// @param storage the name to use in localStorage
	// @param buttonID the id of the element to add a new item
	// @param divID the id of the parent div containing the list
	// @param select the id of the select where the items are written (can be empty)
	// @param initialMap the initial value if none are in localStorage
	// @param verify a function to verify the user input (can be null)
	constructor(storage, buttonID, divID, select, initialMap, verify) {
		this.storage = storage;
		this.buttonID = buttonID;
		this.divID = divID;
		this.select = select;
		this.set = initialMap;
		this.verify = verify;
		document.getElementById(this.buttonID).addEventListener('click', (event) => {
			this.add();
		});
	}

	load() {
		if (!localStorage.getItem(this.storage)) {
			let initialSet = new Map(this.set);
			this.set = new Map();
			for (const [b, weight] of initialSet) {
				this.addElement(b, weight);
			}
			this.store();
			return;
		}
		if (this.select != '') { document.getElementById(this.select).innerHTML = ''; }
		let set = new Map(JSON.parse(localStorage.getItem(this.storage)));
		this.set = new Map();
		for (const [b, weight] of set) {
			this.addElement(b, weight);
		}
	}

	store() {
		localStorage.setItem(this.storage, JSON.stringify(
			Array.from(this.set.entries())));
	}

	addElement(name, value) {
		if (this.set.has(name)) {
			throw new Error(name + ' already defined');
		}
		if (!this.verify(value)) {
			throw new Error(this.storage + ': could not verify ' + value);
		}
		this.set.set(name, value);
		let a = document.getElementById(this.buttonID);
		let list = document.getElementById(this.divID);
		list.removeChild(a);
		let div = document.createElement('div');
		let item = document.createElement('label');
		item.for = name;
		item.innerText = name;
		let weight = document.createElement('input');
		weight.type = 'number';
		weight.min = 0;
		weight.id = name;
		weight.name = name;
		weight.className = "barbell"
		weight.value = value;
		let span = document.createElement('span');
		span.addEventListener('click', (event) => {
			if (!event.target.parentNode || !event.target.parentNode.parentNode) { return; }
			let list = event.target.parentNode.parentNode;
			list.removeChild(event.target.parentNode);
			this.set.delete(event.target.name);
			this.store();
		});
		span.name = name;
		span.className = 'remove';
		div.appendChild(item);
		div.appendChild(weight);
		div.appendChild(span);
		list.appendChild(div);
		list.appendChild(a);
		// Update option list
		if (this.select != '') {
			let seleect = document.getElementById(this.select);
			let option = document.createElement('option');
			option.innerText = name;
			option.value = value;
			seleect.appendChild(option);
		}
		a.style.display = 'block';
	}

	add() {
		let a = document.getElementById(this.buttonID);
		a.style.display = 'none';
		let list = document.getElementById(this.divID);
		let div = document.createElement('div');
		let name = document.createElement('input');
		name.type = 'text';
		name.value = '';
		name.className = 'input-barbell';
		let weight = document.createElement('input');
		weight.type = 'number';
		weight.min = 0;
		weight.id = "todo";
		weight.name = "todo";
		weight.className = "barbell"
		weight.value = 45;
		let span = document.createElement('span');
		span.className = 'complete';
		span.addEventListener('click', (event) => {
			list.removeChild(div);
			this.addElement(name.value, weight.value);
			this.store();
		});
		div.appendChild(name);
		div.appendChild(weight);
		div.appendChild(span);
		list.appendChild(div);
	}
};

class Workout {
	constructor() {
		this.tm = 80;
		this.pct = [65, 75, 85, 70, 80, 90, 75, 85, 95];
		this.barbell = new ListMap('barbell', 'barbell-add-button', 'barbell-list', 'input-barbell', new Map([
			['standard', 45],
			['ssb', 65],
			['olympic', 30],
			['trap', 55],
		]), (v) => true);
		this.exercise = new ListMap('exercise', 'exercise-add-button', 'exercise-list', 'input-exercise', new Map([
			['squat', 335],
			['bench-press', 245],
			['deadlift', 405],
			['overhead-press', 145],
		]), (v) => true);
		this.plates = new ListMap('plates', 'plate-add-button', 'plate-list', '', new Map([
			[45, 10],
			[25, 4],
			[10, 4],
			[5, 4],
			[2.5, 2],
		]), (v) => v%2 == 0);
	}

	load() {
		if (localStorage.getItem('tm')) {
			this.tm = localStorage.getItem('tm');
			document.getElementById('input-tm').value = this.tm;
		} else {
			localStorage.setItem('tm', this.tm);
		}
		if (localStorage.getItem('pct')) {
			this.pct = localStorage.getItem('pct');
			document.getElementById('input-pct').value = this.pct;
		} else {
			localStorage.setItem('pct', this.pct.join(','));
		}
		this.barbell.load();
		this.exercise.load();
		this.plates.load();
	}

	store() {
		localStorage.setItem('tm', this.tm);
		localStorage.setItem('pct', this.pct.join(','));
		this.barbell.store();
		this.exercise.store();
		this.plates.store();
	}

	update() {
		this.tm = document.getElementById('input-tm').value;
		this.pct = [];
		let pctS = document.getElementById('input-pct').value.split(',');
		pctS.forEach(p => { this.pct.push(parseInt(p)); });
		this.store();
	}

	collectValues() {
		let available = [];
		for (const [w, c] of this.plates.set) {
			for (let i = 0; i < c/2; i++) {
				available.push(w*2);
			}
		}
		let targets = [];
		let barbell = parseInt(document.getElementById('input-barbell').value);
		let exercise = parseInt(document.getElementById('input-exercise').value);
		for (const p of this.pct) {
			let n = p / 100 * this.tm / 100 * exercise;
			targets.push((Math.round(n / 5) * 5) - barbell);
		}
		return [available, targets, barbell];
	}

	run() {
		let [available, targets, barbell] = this.collectValues();
		let output = document.getElementById('output-result');
		output.innerHTML = '';
		let allCombinations = solveWeightMinimization(targets, available);
		let result = '';
		// TODO Make this red for remove and green to add
		const table = document.createElement('table');
		const tableBody = document.createElement('tbody');
		for (let i = 0; i < targets.length; i++) {
			const bodyRow = document.createElement('tr');
			const bodyCell = document.createElement('td');
			bodyCell.textContent = targets[i] + barbell
			bodyCell.style.width = '5rem';
			bodyRow.appendChild(bodyCell);
			for (const p of allCombinations[i]) {
				const bodyCell = document.createElement('td');
				bodyCell.textContent = p/2;
				bodyRow.appendChild(bodyCell);
			}
			tableBody.append(bodyRow);
		}
		table.appendChild(tableBody);
		output.appendChild(table);
	}
};

let workout;

window.addEventListener('load', (event) => {
	workout = new Workout();
	workout.load();
	document.getElementById('input-compute').addEventListener('click', (event) => {
		workout.update();
		workout.run();
	});
	document.getElementById('toggle-plates').addEventListener('click', (event) => {
		toggleElement('available-form');
	});

});

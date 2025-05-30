class Multiset {
	constructor(elements) {
		this.set = new Map();
		for (const e of elements) {
			let v = this.set.get(e) ?? 0;
			this.set.set(e, v+1);
		}
	}

	clone() {
		let r = new Multiset([]);
		r.set = new Map(this.set);
		return r;
	}

	[Symbol.iterator]() {
		return this.set[Symbol.iterator]();
	}

	add(e) {
		if (this.set.has(e)) {
			this.set.set(e, this.set.get(e)+1);
			return;
		}
		this.set.set(e, 1);
	}

	delete(e) {
		if (!this.set.has(e)) {
			return;
		}
		const v = this.set.get(e);
		if (v == 1) {
			this.set.delete(e);
			return
		}
		this.set.set(e, v-1);
	}

	empty() { return this.set.size > 0; }

	get(e) { return this.set.get(e); }

	has(e) { return this.set.has(e); }

	difference(b) {
		let r = this.clone();
		for (const [e, cnt] of b.set) {
			let v = r.get(e) ?? 0;
			if (v > cnt) {
				r.set.set(e, v-cnt);
			} else {
				r.set.delete(e);
			}
		}
		return r;
	}
};

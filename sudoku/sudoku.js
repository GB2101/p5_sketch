let calc = 0;
let sec, lim, chg;

let board = [];
let pointer = {
	n: -1,
	m: -1,
	allow: false,
	update: (n, m) => {
		pointer.n = n;
		pointer.m = m;
		if (n >= 0 && n <= 9) {
			if (m >= 0 && m <= 9) {
				pointer.allow = true;
				return;
			}
		}
		pointer.allow = false;
	},
};

function initializeBoard() {
	board = [];
	for (let i = 0; i < 9; i++) {
		board[i] = [];
		for (let j = 0; j < 9; j++) {
			board[i][j] = { num: -1, set: false };
		}
	}
}

//-------------------------------------------

function initializeSolver() {
	calc = 0;
	sec = 0;
	lim = 1;
	chg = 500;
	resetCheck();
	return markCheck();
}

let check = {
	line: [],
	block: [],
	column: [],
};

function resetCheck() {
	for (let i = 0; i < 9; i++) {
		check.line[i] = [];
		check.block[i] = [];
		check.column[i] = [];
		for (let j = 0; j < 9; j++) {
			check.line[i][j] = false;
			check.block[i][j] = false;
			check.column[i][j] = false;
		}
	}
}

function markCheck() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let { n, m } = convert(i, j);
			let a = board[i][j].num;
			let b = board[j][i].num;
			let c = board[n][m].num;

			if (
				!check.line[i][a] &&
				!check.column[i][b] &&
				!check.block[i][c]
			) {
				if (a >= 0) check.line[i][a] = true;
				if (b >= 0) check.column[i][b] = true;
				if (c >= 0) check.block[i][c] = true;
			} else {
				return false;
			}
		}
	}
	return true;
}

//-------------------------------------------

async function solver(i, j) {
	if (solve.pressed) {
		let res = false;
		if (i < 9 && j < 9) {
			pointer.update(i, j);
			await time();

			if (board[i][j].set) {
				return await solver(i, j + 1);
			} else {
				let { n } = convert(i, j);
				for (let v = 0; v < 9 && !res; v++) {
					calc++;

					let a = check.line[i][v];
					let b = check.column[j][v];
					let c = check.block[n][v];

					if (!a && !b && !c) {
						check.line[i][v] = true;
						check.column[j][v] = true;
						check.block[n][v] = true;
						board[i][j] = { num: v, set: false };

						res = await solver(i, j + 1);

						if (!res && solve.pressed) {
							check.line[i][v] = false;
							check.column[j][v] = false;
							check.block[n][v] = false;
							board[i][j] = { num: -1, set: false };
						}
					}
				}
				return res;
			}
		} else if (i == 9) {
			return true;
		} else if (j == 9) {
			return await solver(i + 1, 0);
		}
	}
}

async function time() {
	sec++;
	if (sec % lim == 0) {
		await sleep(1);
		updateLimit();
	}
}

function updateLimit() {
	if (sec == chg) {
		sec = 0;
		lim = lim == 1000 ? lim : lim * 10;
		chg = chg == 500000 ? chg : chg * 10;
		console.log(lim, chg);
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

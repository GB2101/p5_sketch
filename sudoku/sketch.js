function setup() {
	createCanvas(innerWidth - 4, innerHeight - 4);
	h = height / 10;

	generateInput();
	initializeBoard();
}

function draw() {
	n = 0;
	m = 0;
	background(0);
	scores();
	translate(width / 2, height / 2);
	createBoard();
	if (input.pressed) {
		getInput();
	} else if (quick.pressed) {
		getBoard();
	} else if (!solve.pressed) {
		pointer.update(-1, -1);
	}
}

//---------------------------------------------

function scores() {
	fill(255 / 3);
	stroke(255);
	strokeWeight(4);
	textSize(h);
	rectMode(CORNER);
	textAlign(LEFT);
	text('Sudoku\nSolver', 15, h + 15);

	let status = '';
	if (result.finished) {
		if (result.solved) {
			status = 'Solved';
		} else {
			status = 'Invalid';
		}
	} else {
		if (result.running) {
			status = 'running...';
		} else {
			status = 'Waiting';
		}
	}

	fill(255);
	noStroke();
	textSize(h / 2);
	let str = `Status: ${status}`;
	let tam = textWidth(str);
	text(str, width - (tam + 15), h / 2 + 15);

	str = result.finished || result.running ? `Calculations: ${calc}` : '';
	textSize(h / 3);
	tam = textWidth(str);
	text(str, width - (tam + 15), 2 * (h / 2 + 15));
}

//---------------------------------------------

let square = [
	{ x: -1, y: -1 },
	{ x: 0, y: -1 },
	{ x: 1, y: -1 },
	{ x: -1, y: 0 },
	{ x: 0, y: 0 },
	{ x: 1, y: 0 },
	{ x: -1, y: 1 },
	{ x: 0, y: 1 },
	{ x: 1, y: 1 },
];

let h = 80; //Value changed by setup()
let n = 0;
let m = 0;

function createBoard(i = 3) {
	let s = h * i;
	for (let p of square) {
		let x = p.x * s;
		let y = p.y * s;
		if (i > 1) {
			push();
			translate(x, y);
			createBoard(1);
			pop();
		}
		cell(i, s, x, y);
	}
}

function cell(i, s, x, y) {
	let col = (255 / 3) * i;
	i === 1 ? fill(col / 2) : noFill();
	stroke(col);
	strokeWeight(i);
	rectMode(CENTER);
	rect(x, y, s, s);

	if (i === 1) {
		let con = convert(n, m);
		let t = board[con.n][con.m];
		fill(col);
		stroke(255);
		textSize(h / 3);
		textAlign(CENTER, CENTER);
		mark(x, y, s);
		if (t.set) {
			fill(255);
		}
		if (t.num >= 0) {
			text(t.num + 1, x, y);
		}

		m++;
	} else {
		n++;
		m = 0;
	}
}

function convert(a, b) {
	let x = floor(a / 3) * 3;
	x += floor(b / 3);
	let y = (a % 3) * 3;
	y += b % 3;
	return { n: x, m: y };
}

function mark(x, y, s) {
	let con = convert(n, m);
	if (con.n == pointer.n && con.m == pointer.m) {
		ellipse(x, y, (3 * s) / 4);
		fill(255);
	}
}

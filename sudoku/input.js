let quick, input, solve, reset, save, load;
let result;

function generateInput() {
	reset = myButton('Reset', 15, height - 4 * (h + 15));
	quick = myButton('Quick Input', 15, height - 3 * (h + 15));
	input = myButton('Change Input', 15, height - 2 * (h + 15));
	solve = myButton('Solve', 15, height - (h + 15));

	load = myButton('Load', width - (2.5 * h + 15), height - 2 * (h + 15));
	save = myButton('Save', width - (2.5 * h + 15), height - (h + 15));

	result = { finished: false, solved: false, running: false };

	input.button.mouseClicked(() => {
		press(input);
	});

	quick.button.mouseClicked(() => {
		qn = 0;
		qm = 0;
		aft = 0;
		bef = 0;
		press(quick);
	});

	reset.button.mouseClicked(() => {
		calc = 0;
		press();
		initializeBoard();
	});

	solve.button.mouseClicked(async () => {
		press(solve);
		result = { finished: false, solved: false, running: true };
		let valid = initializeSolver();
		if (valid) {
			await solver(0, 0);
			press();
			result = { finished: true, solved: true, running: false };
		} else {
			press();
			result = { finished: true, solved: false, running: false };
		}
	});

	load.button.mouseClicked(() => {
		press();
		let storage = localStorage.getItem('Board');
		board = JSON.parse(storage);
		if (board == null) {
			initializeBoard();
		}
	});

	save.button.mouseClicked(() => {
		press();
		let store = board.map((array) =>
			array.map((obj) => {
				if (obj.set) {
					return obj;
				} else {
					return { num: -1, set: false };
				}
			}),
		);
		localStorage.setItem('Board', JSON.stringify(store));
	});
}

function getInput() {
	let x = mouseX;
	x -= (width + h) / 2;
	x = floor(x / h);
	x += 5;

	let y = mouseY;
	y -= (height + h) / 2;
	y = floor(y / h);
	y += 5;

	pointer.update(y, x);
}

function keyPressed() {
	if (input.pressed) {
		updateNumber();
	} else if (quick.pressed) {
		aft++;
	}
}

function updateNumber() {
	if (pointer.allow) {
		let i = pointer.n;
		let j = pointer.m;
		if (key > 0 && key <= 9) {
			let num = parseInt(key) - 1;
			board[i][j] = { num, set: true };
		} else if (key == 0) {
			board[i][j] = { num: -1, set: false };
		} else if (keyCode == BACKSPACE) {
			return { bool: true, back: true };
		} else {
			return { bool: false, back: false };
		}
		return { bool: true };
	}
}

let aft = 0;
let bef = 0;
let qn = 0;
let qm = 0;

function getBoard() {
	pointer.update(qn, qm);
	if (aft != bef) {
		let { bool, back } = updateNumber();
		if (!bool) {
			aft--;
			return;
		} else if (back) {
			qm--;
			if (qm == -1) {
				qm = 8;
				qn--;
				if (qn == -1) {
					qm = 0;
					qn = 0;
				}
			}
		}
		bef++;
		if (!back) {
			qm++;
			if (qm == 9) {
				qm = 0;
				qn++;
				if (qn == 9) {
					qn = 0;
					pressed(quick);
					pointer.update(-1, -1);
				}
			}
		}
	}
}

function press(untouch) {
	result = { finished: false, solved: false, running: false };
	pressTest(untouch, quick);
	pressTest(untouch, input);
	pressTest(untouch, solve);
	pressTest(untouch, reset);
}

function pressTest(untouch, button) {
	if (untouch == button) {
		pressed(button);
	} else if (button.pressed) {
		pressed(button);
	}
}

function myButton(text, x, y) {
	let button = createButton(text);
	button.size(2.5 * h, h);
	button.position(x, y);

	button.style('color', '#fff');
	button.style('font-size', `${h / 3}px`);
	button.style('border-radius', '8px');
	button.style('background-color', '#414141');
	button.style('border', '2px solid #656565');
	button.style('transition-duration', '0.3s');

	let input = {
		button,
		pressed: false,
		colors: {
			back: '#414141',
			text: '#ffffff',
		},
	};

	button.mouseOver(() => {
		button.style('color', '#414141');
		button.style('background-color', '#ffffff');
		button.style('cursor', 'pointer');
	});

	button.mouseOut(() => {
		button.style('color', input.colors.text);
		button.style('background-color', input.colors.back);
	});

	return input;
}

function pressed(button) {
	button.pressed = !button.pressed;
	let col = button.colors;
	button.pressed ? (col.text = '#414141') : (col.text = '#ffffff');
	button.pressed ? (col.back = '#ffffff') : (col.back = '#414141');
	button.button.style('color', button.colors.text);
	button.button.style('background-color', button.colors.back);
}

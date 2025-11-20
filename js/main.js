import { CountUp } from "https://cdn.jsdelivr.net/npm/countup.js@2.8.0/dist/countUp.js";

const btnAdd = document.getElementById("add");
const btnRemove = document.getElementById("remove");
const btnReset = document.getElementById("reset");
const btnValidate = document.getElementById("validate");

const payInput = document.getElementById("pay-input");

const timeValue = document.getElementById("time-value");

const totalHour = document.getElementById("total-hour");
const totalDay = document.getElementById("total-day");
const totalWeek = document.getElementById("total-week");

const DELTA_CLICK = 100;
const WORK_HOUR_IN_MONTH = 151.67;

const MIN_PRECISION = 0;
const MAX_PRECISION = 4;
const DEFAULT_PRECISION = 2;

const DEFAULT_PAY = 1490;

payInput.value = DEFAULT_PAY;

let isCounterActive = false;
let startDate = null;

let countInterval = null;
let payEachSecond = 0;

let payPrecision = DEFAULT_PRECISION;

setIsCounterActive(false);

const ops = {
	decimalPlaces: payPrecision, // nb de digits après la virgule
	separator: " ",
	duration: 1,
};

let counter = new CountUp("money-value", 0, ops);

// This is an example script, please modify as needed
const rangeInput = document.getElementById("precision-number");
const rangeOutput = document.getElementById("precision-number-value");

// Set initial value
rangeInput.value = payPrecision;
rangeOutput.textContent = payPrecision;

rangeInput.addEventListener("input", function () {
	if (this.value < 0) this.value = MIN_PRECISION;
	if (this.value > 4) this.value = MAX_PRECISION;

	payPrecision = this.value;
	rangeOutput.textContent = this.value;

	const current = counter.frameVal;

	const options = {
		...structuredClone(ops),
		decimalPlaces: payPrecision,
		startVal: current,
	};

	counter.pauseResume();
	counter = new CountUp("money-value", current, options);
	counter.start();

	count();
});

function count() {
	const timeElapsed = Date.now() - startDate;
	timeValue.textContent = toHHMMSS(timeElapsed);

	const money = ((timeElapsed / 1000) * payEachSecond).toFixed(payPrecision);
	counter.update(money);
}

function start() {
	if (isCounterActive || countInterval !== null) {
		return;
	}

	const pay = Number(payInput.value);
	payEachSecond = pay / WORK_HOUR_IN_MONTH / 3600;

	startDate = Date.now();

	if (counter.error) {
		alert(counter.error);
		return;
	}

	counter.start();

	countInterval = setInterval(count, 1000);
	count();

	const payEachHour = payEachSecond * 3600;
	const payEachDay = payEachHour * 7;
	const payEachWeek = payEachDay * 5;

	totalHour.textContent = payEachHour.toFixed(payPrecision);
	totalDay.textContent = payEachDay.toFixed(payPrecision);
	totalWeek.textContent = payEachWeek.toFixed(payPrecision);
}

function reset() {
	timeValue.textContent = "00:00:00";

	totalHour.textContent = "0";
	totalDay.textContent = "0";
	totalWeek.textContent = "0";

	counter.pauseResume();
	counter.reset();

	clearInterval(countInterval);

	startDate = null;
	countInterval = null;

	setIsCounterActive(false);
}

function setIsCounterActive(value) {
	isCounterActive = value;

	payInput.disabled = value;

	btnAdd.disabled = value;
	btnRemove.disabled = value;

	btnReset.disabled = !value;
	btnValidate.disabled = value;
}

btnAdd.addEventListener("click", () => {
	payInput.value = Number(payInput.value) + DELTA_CLICK;
});

btnRemove.addEventListener("click", () => {
	if (payInput.value - DELTA_CLICK >= 0) {
		payInput.value = Number(payInput.value) - DELTA_CLICK;
	}
});

btnReset.addEventListener("click", () => {
	reset();
});

btnValidate.addEventListener("click", () => {
	if (!isCounterActive) {
		start();
		setIsCounterActive(true);
	}
});

import { CountUp } from "https://cdn.jsdelivr.net/npm/countup.js@2.8.0/dist/countUp.js";

const btnAdd = document.getElementById("add");
const btnRemove = document.getElementById("remove");
const btnReset = document.getElementById("reset");
const btnValidate = document.getElementById("validate");

const payInput = document.getElementById("pay-input");

const timeValue = document.getElementById("time-value");
const moneyValue = document.getElementById("money-value");

const DELTA_CLICK = 100;
const WORK_HOUR_IN_MONTH = 151.67;
const PAY_PRECISION = 3;

let isCounterActive = false;
let startDate = null;

let countInterval = null;
let payEachSecond = 0;

setIsCounterActive(false);

let counter = new CountUp("money-value", 0, {
	decimalPlaces: PAY_PRECISION, // nb de digits après la virgule
	separator: " ",
	decimal: ",",
	duration: 1,
});

function count() {
	const secondElapsed = (Date.now() - startDate) / 1000;

	const money = (secondElapsed * payEachSecond).toFixed(PAY_PRECISION);
	counter.update(money);

	const time = secondElapsed.toFixed(0);

	timeValue.textContent = time;
}

function start() {
	if (isCounterActive || countInterval !== null) {
		return;
	}

	const pay = Number(payInput.value);
	payEachSecond = pay / WORK_HOUR_IN_MONTH / 60 / 60;

	startDate = Date.now();

	if (counter.error) {
		alert(counter.error);
		return;
	}

	counter.start();

	count();
	countInterval = setInterval(count, 1000);
}

function reset() {
	timeValue.textContent = "0";
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

function toHHMMSS(ms) {
	const totalSec = Math.floor(ms / 1000);
	const h = Math.floor(totalSec / 3600);
	const m = Math.floor((totalSec % 3600) / 60);
	const s = totalSec % 60;

	return [h.toString().padStart(2, "0"), m.toString().padStart(2, "0"), s.toString().padStart(2, "0")].join(":");
}

Number.prototype.toFixedNoRound = function (decimals) {
	const factor = 10 ** decimals;
	return Math.floor(this * factor) / factor;
};

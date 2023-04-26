let bottomsters: Bottomsters;
async function submit() {
	let username = document.querySelector("input")!.value;
	let text = document.querySelectorAll("input")[1]!.checked;
	let timeframe = document.querySelector("select")!.value;
	let count = parseInt(document.querySelectorAll("select")[1]!.value);

	console.log(username, timeframe);

	let dimensions = Math.round(Math.sqrt(count));

	bottomsters = new Bottomsters("display", dimensions, dimensions, text);

	await bottomsters.makeLastFmChart(username, timeframe);
}

function download() {
	if (!bottomsters) {
		return;
	}
	bottomsters.download();
}

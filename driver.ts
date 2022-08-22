let bottomsters: Bottomsters;
async function submit() {
	let username = document.querySelector("input")!.value;
	let timeframe = document.querySelector("select")!.value;
	let count = parseInt(document.querySelectorAll("select")[1]!.value);

	console.log(username, timeframe);

	let dimensions = Math.round(Math.sqrt(count));

	bottomsters = new Bottomsters("display", dimensions, dimensions);

	await bottomsters.makeLastFmChart(username, timeframe);
}

function download() {
	if (!bottomsters) {
		return;
	}
	bottomsters.download();
}

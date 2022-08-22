let bottomsters = new Bottomsters("display");

async function submit() {
	let username = document.querySelector("input")!.value;
	let timeframe = document.querySelector("select")!.value;

	console.log(username, timeframe);

	await bottomsters.makeLastFmChart(username, timeframe);
}

function download() {
	bottomsters.download();
}

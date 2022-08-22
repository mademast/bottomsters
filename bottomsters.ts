class Bottomsters {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	displayDom: HTMLDivElement;
	width: number;
	height: number;
	albums: Album[];
	scale: number;
	/**
	 * Constructs a Bottomsters object. The provided displayId will be filled with a square canvas
	 * taking up as much room as possible.
	 * @param {string} displayId - The ID of the DOM element to append the display canvas to
	 */
	constructor(displayId: string, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.canvas = document.createElement("canvas");

		// Assumes a collage where each image is 300x300
		this.canvas.width = 300 * width;
		this.canvas.height = 300 * height;

		this.canvas.onclick = this.handleClick.bind(this);
		this.canvas.onmousemove = this.handleMouseOver.bind(this);

		this.ctx = this.canvas.getContext("2d")!;

		this.displayDom = document.getElementById(displayId) as HTMLDivElement;
		this.resizeDisplay();
		this.displayDom.replaceChildren(this.canvas);

		window.addEventListener("resize", this.resizeDisplay.bind(this));
	}

	async makeLastFmChart(username: string, timeframe: string) {
		this.albums = await this.getAlbums(username, timeframe);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawCollage();
	}

	async getAlbums(username: string, timeframe: string) {
		const url = new URL("https://ws.audioscrobbler.com/2.0/");
		const params = new URLSearchParams({
			method: "user.gettopalbums",
			user: username,
			period: timeframe,
			api_key: "0a828de6701971f3766542996b54c24b",
			format: "json",
		});
		url.search = params.toString();

		const json = await fetch(url).then((res) => res.json());
		const albums: any[] = json.topalbums.album;

		return albums
			.map((album) => ({
				title: album.name,
				artist: album.artist.name,
				playcount: album.playcount,
				src: album.image[3]["#text"],
			}))
			.filter((album) => album.src);
	}

	drawCollage() {
		for (let i = 0; i < this.albums.length; ++i) {
			let album = this.albums[i];

			let image = document.createElement("img");
			image.src = album.src;

			// https://stackoverflow.com/a/30517793
			image.crossOrigin = "anonymous";

			const x = (i % this.width) * 300;
			const y = Math.floor(i / this.height) * 300;

			image.onload = () => this.ctx.drawImage(image, x, y, 300, 300);
		}
	}

	selectAlbum(e: MouseEvent) {
		const x = e.offsetX;
		const y = e.offsetY;
		const image_size = 300 * this.scale;
		const index = Math.floor(y / image_size) * this.width + Math.floor(x / image_size);
		if (index >= this.albums.length) {
			return;
		}
		return this.albums[index];
	}

	handleMouseOver(e: MouseEvent) {
		const album = this.selectAlbum(e);
		if (!album) {
			return;
		}
		this.canvas.title = `${album.artist} - ${album.title}`;
	}

	handleClick(e: MouseEvent) {
		const album = this.selectAlbum(e);
		if (!album) {
			return;
		}
		window.open(`https://www.last.fm/music/${album.artist}/${album.title}`);
	}

	resizeDisplay() {
		let sidelength = Math.min(this.displayDom.clientWidth, this.displayDom.clientHeight);
		this.scale = sidelength / (this.width * 300);
		this.canvas.style.width = sidelength + "px";
		this.canvas.style.height = sidelength + "px";
	}

	download() {
		// https://stackoverflow.com/a/43523297
		let a = document.createElement("a");
		a.text = "Download PNG";
		a.href = this.canvas.toDataURL("image/png");
		a.download = "bottomsters.png";
		a.click();
	}
}

type Album = {
	title: string;
	artist: string;
	playcount: string;
	src: string;
};

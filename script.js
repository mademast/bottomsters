async function submit() {
    let username = document.querySelector("input").value;
    let timeframe = document.querySelector("select").value;

    console.log(username, timeframe);

    let albums = await getAlbums(username, timeframe);
    set_grid(albums);
}

async function getAlbums(username, timeframe) {
    return await fetch(
        `https://3g5e43is58.execute-api.us-west-2.amazonaws.com/prod/lastfm_import/${username}/${timeframe}`
    )
        .then((res) => res.text())
        .then((text) => {
            return JSON.parse(text.substring(0, text.length - 1) + "]");
        });
}

function set_grid(albums) {
    let display = document.getElementById("display");

    let sideLength = Math.min(display.clientWidth, display.clientHeight);
    let fifth = sideLength / 5;

    let canvas = document.createElement('canvas');
    canvas.width = sideLength;
    canvas.height = sideLength;
    canvas.style.border = "1px solid black";

    // Stick this on the window so we can grab it later
    window.bottomCanvas = canvas;

    display.appendChild(canvas);

    let ctx = canvas.getContext("2d");

    let i = 0;
    for (let album of albums) {
        console.log(album.title);

        // Set a new index within the loop so all onload callbacks don't have 25
        let curri = i;
        let image = document.createElement("img");
        image.src = album.src;
        image.crossOrigin = "anonymous";
        image.onload = function () {
            ctx.drawImage(
                image,
                (curri % 5) * fifth,
                Math.floor(curri / 5) * fifth,
                fifth,
                fifth
            );
            console.log(album.title + " " + curri);
        }

        ++i;
    }
}

function download() {
    let a = document.createElement('a');
    a.text = "Download PNG";
    a.href = window.bottomCanvas.toDataURL('image/png');
    a.download = "bottomsters.png";
    a.click();
    //document.getElementById("controls").appendChild(a);
}
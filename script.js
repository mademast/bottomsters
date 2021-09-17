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
    let grid = document.querySelector("div");
    grid.innerHTML = "";
    for (album of albums) {
        let image = document.createElement("img");
        image.src = album.src;
        console.log(album.title);
        grid.appendChild(image);
    }
}
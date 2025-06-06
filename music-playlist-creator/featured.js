const createFeatureHeader = (playlist) => {
    const headerElement = document.createElement("div");
    headerElement.className = "featured-header";
    headerElement.innerHTML += `
        <h2>${playlist.title}</h2>
        <img src=${playlist.cover} class="featured-cover">
    `;
    return headerElement;
}

const createFeatureSong = (song) => {
    const songElement = document.createElement("div");
    songElement.className = "featured-song";
    songElement.innerHTML += `
        <img src=${song.cover}>
        <div class="featured-song-info">
            <p><strong>${song.name}</strong></p>
            <p>${song.artist}</p>
            <p>${song.album}</p>
            <p>${song.duration}</p>
        </div>
    `;
    return songElement;
}

document.addEventListener("DOMContentLoaded", () => {
    const featuredIndex = Math.floor(Math.random() * playlists.length); 
    const playlist = playlists[featuredIndex];

    const featuredContainer = document.querySelector(".featured-flex");
    const header = createFeatureHeader(playlist);
    featuredContainer.appendChild(header);

    const songsList = document.querySelector(".featured-songs");
    featuredContainer.appendChild(songsList);
    for (let song of playlist.songs) {
        console.log(song);
        const newSong = createFeatureSong(song);
        songsList.appendChild(newSong);
    };
})
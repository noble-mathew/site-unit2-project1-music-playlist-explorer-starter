const createPlaylist = (playlist) => {
  const playlistElement = document.createElement("div");
  playlistElement.className = "playlist-card";
  playlistElement.innerHTML += `
    <img src=${playlist.cover} class="playlist-card-cover" id="card-cover-${playlist.id}">
    <img src="/assets/img/delete.webp" class="delete-playlist">
    <img src="/assets/img/pencil.png" class="edit-playlist">
    <h4 class="playlist-title" id="title-${playlist.id}">${playlist.title}</h4>
    <h6 class="playlist-creator" id="creator-${playlist.id}">${playlist.creator}</h6>
    <div class="like-count">
        <img src="/assets/img/white-heart.png" class="heart" id="heart-${playlist.id}">
        <p id="like-count-${playlist.id}">${playlist.likeCount}</p>
    </div>
  `;
  return playlistElement;
};

const playlistContainer = document.querySelector(".playlists");
const loadPlaylists = () => {
  const playlistContainer = document.querySelector(".playlists");
  for (const playlist of playlists) {
    const newPlaylist = createPlaylist(playlist);
    playlistContainer.appendChild(newPlaylist);
  }
};

const createModalHeader = (playlist) => {
  const headerElement = document.createElement("div");
  headerElement.className = "modal-playlist-header";
  headerElement.innerHTML += `
    <img src=${playlist.cover} class="modal-cover">
    <div class="modal-playlist-title">
        <h2>${playlist.title}</h2>
        <p>${playlist.creator}</p>
        <button class="shuffle">Shuffle</button>
    </div>
  `;
  return headerElement;
};

const createModalSong = (song) => {
  const songElement = document.createElement("div");
  songElement.className = "modal-song";
  songElement.innerHTML += `
    <img src=${song.cover}>
    <div class="modal-song-info">
        <p class="modal-song-name"><strong>${song.name}</strong></p>
        <p class="modal-song-not-name">${song.artist}</p>
        <p class="modal-song-not-name">${song.album}</p>
    </div>
    <p class="modal-song-length">${song.duration}</p>
  `;
  return songElement;
};

const createEditHeader = (playlist) => {
  const headerElement = document.createElement("div");
  headerElement.className = "modal-playlist-header";
  headerElement.innerHTML += `
    <img src=${playlist.cover} class="modal-cover">
    <div class="modal-playlist-title">
        <h2>${playlist.title}</h2>
        <p>${playlist.creator}</p>
        <button class="shuffle">Shuffle</button>
    </div>
  `;
  return headerElement;
};

let currentPlaylistID;
let currentPlaylistEdit;
let editPlaylist;
document.addEventListener("DOMContentLoaded", () => {
  loadPlaylists();

  // Modal Opening and Closing Script
  const modal = document.getElementById("modal");
  const modalOutside = modal.querySelector(".modal-overlay");
  const modalX = modal.querySelector(".modal-close");

  const hide = () => (modal.style.display = "none");
  document.querySelectorAll(".playlist-card").forEach((card, index) =>
    card.addEventListener("click", (event) => {
      currentPlaylistID = playlists[index].id;
      const clickedPlaylist = playlists.find(
        (playlist) => playlist.id === currentPlaylistID
      );

      if (event.target.classList.contains("heart")) {
        if (clickedPlaylist.likedPlaylist) {
          clickedPlaylist.likeCount--;
        } else {
          clickedPlaylist.likeCount++;
        }

        let likeCount = document.getElementById(
          `like-count-${currentPlaylistID}`
        );
        likeCount.textContent = clickedPlaylist.likeCount;

        let heartImage = document.getElementById(`heart-${currentPlaylistID}`);
        heartImage.src = clickedPlaylist.likedPlaylist
          ? "/assets/img/white-heart.png"
          : "/assets/img/red-heart.png";

        clickedPlaylist.likedPlaylist = !clickedPlaylist.likedPlaylist;
      } else if (event.target.classList.contains("delete-playlist")) {
        const playlistCard = event.target.closest(".playlist-card");
        playlistCard.remove();
      } else if (event.target.classList.contains("edit-playlist")) {
        editPlaylist = true;
        if (clickedPlaylist === currentPlaylistEdit) {
          addPlaylistContainer.classList.add("hidden");
          currentPlaylistEdit = "";
        } else {
          addPlaylistContainer.classList.remove("hidden");
          currentPlaylistEdit = "";
        }

        currentPlaylistEdit = clickedPlaylist;

        const coverAlbumInput = document.querySelector(".add-album-cover");
        const albumNameInput = document.querySelector(".add-album-name");
        const albumCreatorInput = document.querySelector(".add-album-creator");

        coverAlbumInput.value = clickedPlaylist.cover;
        albumNameInput.value = clickedPlaylist.title;
        albumCreatorInput.value = clickedPlaylist.creator;

        const addPlaylistBtn = document.querySelector(".add-playlist-btn");
        addPlaylistBtn.classList.add("hidden");

        const savePlaylistBtn = document.querySelector(".save-playlist-btn");
        savePlaylistBtn.classList.remove("hidden");

        const songsContainer = document.querySelector(".songs-container");
        while (songsContainer.firstChild) {
          songsContainer.removeChild(songsContainer.firstChild);
        }

        let playlistSongs = clickedPlaylist.songs;
        playlistSongs.forEach((song) => {
          addSongContainer.appendChild(addSongToEdit(song));
        });

        savePlaylistBtn.addEventListener("click", () => {
          clickedPlaylist.title = albumNameInput.value;
          let title = document.getElementById(`title-${currentPlaylistID}`);
          title.textContent = clickedPlaylist.title;

          clickedPlaylist.creator = albumCreatorInput.value;
          let creator = document.getElementById(`creator-${currentPlaylistID}`);
          creator.textContent = clickedPlaylist.creator;

          clickedPlaylist.cover = coverAlbumInput.value;
          let cover = document.getElementById(`card-cover-${currentPlaylistID}`);
          cover.src = clickedPlaylist.cover;


          const playlistSongs   = document.querySelectorAll(".songs-container .add-song");
          const updatedSongs = [];

          playlistSongs.forEach(row => {
            const cover    = row.querySelector(".add-song-cover").value.trim();
            const name     = row.querySelector(".add-song-name").value.trim();
            const artist   = row.querySelector(".add-song-artist").value.trim();
            const album    = row.querySelector(".add-song-album").value.trim();
            const duration = row.querySelector(".add-song-duration").value.trim();

            updatedSongs.push({ cover, name, artist, album, duration });
          });

          /* Replace the playlist’s song list with the new one */
          clickedPlaylist.songs = updatedSongs;

          const newSongsContainer = document.querySelectorAll(".songs-container .add-song");
          newSongsContainer.forEach((song) => {
            song.remove();
          });

          coverAlbumInput.value = "/assets/img/playlist.png";
          albumNameInput.value = "Album Name";
          albumCreatorInput.value = "Album Creator";

          addPlaylistContainer.classList.add("hidden");
        });
      } else {
        const modalContainer = document.querySelector(
          ".modal-playlist-header-container"
        );
        const header = createModalHeader(clickedPlaylist);
        modalContainer.appendChild(header);

        const modalSongContainer = document.querySelector(".modal-songs-flex");
        for (const song of clickedPlaylist.songs) {
          const newSong = createModalSong(song);
          modalSongContainer.appendChild(newSong);
        }

        modal.style.display = "block";

        const shuffleButton = document.querySelector(".shuffle");
        shuffleButton.addEventListener("click", () => {
          const currentPlaylist = playlists.find(
            (playlist) => playlist.id === currentPlaylistID
          );

          shuffleArray(currentPlaylist.songs);

          const modalSongContainer =
            document.querySelector(".modal-songs-flex");
          modalSongContainer.innerHTML = "";
          for (const song of currentPlaylist.songs) {
            const newSong = createModalSong(song);
            modalSongContainer.appendChild(newSong);
          }
        });
      }
    })
  );

  modalOutside.addEventListener("click", () => {
    hide();
    let modalHeader = document.querySelector(".modal-playlist-header");
    modalHeader.remove();

    const modalSongs = document.querySelectorAll(".modal-song");
    for (let song of modalSongs) {
      song.remove();
    }
  });
  modalX.addEventListener("click", () => {
    hide();
    let modalHeader = document.querySelector(".modal-playlist-header");
    modalHeader.remove();

    const modalSongs = document.querySelectorAll(".modal-song");
    for (let song of modalSongs) {
      song.remove();
    }
  });
});

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const searchField = document.getElementById("search");
const searchBtn = document.querySelector(".search");
searchBtn.addEventListener("click", () => {
  const value = searchField.value.toLowerCase();
  document.querySelectorAll(".playlist-card").forEach((card, index) => {
    const playlist = playlists[index];
    const isVisible =
      playlist.title.toLowerCase().includes(value) ||
      playlist.creator.toLowerCase().includes(value);
    card.style.display = isVisible ? "block" : "none";
  });
});

const clearBtn = document.querySelector(".clear-search");
clearBtn.addEventListener("click", () => {
  searchField.value = "";
  document.querySelectorAll(".playlist-card").forEach((card, index) => {
    card.style.display = "block";
  });
});

const sortSelect = document.getElementById("sort");
sortSelect.addEventListener("change", () => {
  const selectedValue = sortSelect.value;
  const playlistContainer = document.querySelector(".playlists");
  playlistContainer.innerHTML = "";

  if (selectedValue === "alphabetical") {
    playlists.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedValue === "likes-descending") {
    playlists.sort((a, b) => b.likeCount - a.likeCount);
  } else if (selectedValue === "date-recent") {
    playlists.sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
  }

  playlists.forEach((playlist) => {
    const playlistCard = createPlaylist(playlist);
    playlistContainer.appendChild(playlistCard);
  });
});

const addSongToForm = () => {
  const newSongElement = document.createElement("div");
  newSongElement.className = "add-song";
  newSongElement.innerHTML += `
    <img src="/assets/img/delete.webp" class="delete-new-song">
    <input class="add-song-cover" value="/assets/img/song.png">
    <input class="add-song-name" value="Song Name">
    <input class="add-song-artist" value="Artist">
    <input class="add-song-album" value="Album Name">
    <input class="add-song-duration" value="0:00">
  `;
  return newSongElement;
};

const addSongToEdit = (song) => {
  const newSongElement = document.createElement("div");
  newSongElement.className = "add-song";
  newSongElement.innerHTML += `
    <img src="/assets/img/delete.webp" class="delete-new-song">
    <input class="add-song-cover" value=${song.cover}>
    <input class="add-song-name" value=${song.name}>
    <input class="add-song-artist" value=${song.artist}>
    <input class="add-song-album" value=${song.album}>
    <input class="add-song-duration" value=${song.duration}>
  `;
  return newSongElement;
};

const addSongContainer = document.querySelector(".songs-container");
const addSongBtn = document.querySelector(".add-song-btn");
addSongBtn.addEventListener("click", () => {
  addSongContainer.appendChild(addSongToForm());
});

const attachDeleteEventListeners = () => {
  const deleteNewSongBtns = document.querySelectorAll(".delete-new-song");
  deleteNewSongBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const container = event.target.parentNode;
      container.remove();
    });
  });
};

attachDeleteEventListeners();
document.querySelector(".add-song-btn").addEventListener("click", () => {
  attachDeleteEventListeners();
});

const addPlaylistBtn = document.querySelector(".add-playlist-btn");
addPlaylistBtn.addEventListener("click", () => {
  const coverAlbumInput = document.querySelector(".add-album-cover");
  const albumNameInput = document.querySelector(".add-album-name");
  const albumCreatorInput = document.querySelector(".add-album-creator");
  const newPlaylist = {
    id: playlists[playlists.length - 1].id + 1,
    cover: coverAlbumInput.value,
    title: albumNameInput.value,
    creator: albumCreatorInput.value,
    likeCount: Math.floor(Math.random() * 10),
    likedBy: false,
    songs: [],
  };

  const newSongsContainer = document.querySelectorAll(
    ".songs-container .add-song"
  );
  newSongsContainer.forEach((song) => {
    const songCoverInput = song.querySelector(".add-song-cover");
    const songNameInput = song.querySelector(".add-song-name");
    const songArtistInput = song.querySelector(".add-song-artist");
    const songAlbumInput = song.querySelector(".add-song-album");
    const songDurationInput = song.querySelector(".add-song-duration");

    const songData = {
      name: songNameInput.value,
      artist: songArtistInput.value,
      album: songAlbumInput.value,
      duration: songDurationInput.value,
      cover: songCoverInput.value,
    };

    newPlaylist.songs.push(songData);
  });

  const playlistContainer = document.querySelector(".playlists");
  const newPlaylistCard = createPlaylist(newPlaylist);
  playlistContainer.appendChild(newPlaylistCard);
  addPlaylistContainer.classList.add("hidden");

  newSongsContainer.forEach((song) => {
    song.remove();
  });

  coverAlbumInput.value = "/assets/img/playlist.png";
  albumNameInput.value = "Album Name";
  albumCreatorInput.value = "Album Creator";
});

const addBtn = document.querySelector("#add-btn");
const addPlaylistContainer = document.querySelector(".add-song-container");
addBtn.addEventListener("click", () => {
  if (addPlaylistContainer.classList.contains("hidden")) {
    addPlaylistContainer.classList.remove("hidden");
  } else if (!editPlaylist) {
    addPlaylistContainer.classList.add("hidden");
  } else {
    editPlaylist = false;
  }

  clickedPlaylist = "";

  const addPlaylistBtn = document.querySelector(".add-playlist-btn");
  addPlaylistBtn.classList.remove("hidden");

  const savePlaylistBtn = document.querySelector(".save-playlist-btn");
  savePlaylistBtn.classList.add("hidden");

  const coverAlbumInput = document.querySelector(".add-album-cover");
  const albumNameInput = document.querySelector(".add-album-name");
  const albumCreatorInput = document.querySelector(".add-album-creator");

  coverAlbumInput.value = "/assets/img/playlist.png";
  albumNameInput.value = "Album Name";
  albumCreatorInput.value = "Album Creator";

  const songsContainer = document.querySelector(".songs-container");
  while (songsContainer.firstChild) {
    songsContainer.removeChild(songsContainer.firstChild);
  }
});

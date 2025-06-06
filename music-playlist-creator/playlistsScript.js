const createPlaylist = (playlist) => {
  const playlistElement = document.createElement("div");
  playlistElement.className = "playlist-card";
  playlistElement.innerHTML += `
    <img src=${playlist.cover} class="playlist-card-cover">
    <h4 class="playlist-title">${playlist.title}</h4>
    <h6 class="playlist-creator">${playlist.creator}</h6>
    <div class="like-count">
        <img src="/assets/img/white-heart.png" class="heart" id="heart-${playlist.id}">
        <p id="like-count-${playlist.id}">${playlist.likeCount}</p>
    </div>
  `
  return playlistElement;
}

const playlistContainer = document.querySelector(".playlists");
const loadPlaylists = () => {
  const playlistContainer = document.querySelector(".playlists");
  for (const playlist of playlists) {
    const newPlaylist = createPlaylist(playlist);
    playlistContainer.appendChild(newPlaylist);
  }
}

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
  `
  return headerElement;
}

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
  `
  return songElement;
}

let currentPlaylistID;
document.addEventListener("DOMContentLoaded", () => {
  loadPlaylists();

  // Modal Opening and Closing Script
  const modal = document.getElementById('modal');
  const modalOutside = modal.querySelector('.modal-overlay');
  const modalX = modal.querySelector('.modal-close');

  const hide = () => modal.style.display = 'none';
  document.querySelectorAll('.playlist-card').forEach((card, index) => 
    card.addEventListener('click', (event) => {
      currentPlaylistID = playlists[index].id;
      const clickedPlaylist = playlists.find(playlist => playlist.id === currentPlaylistID);

      if (event.target.classList.contains('heart')) {
        console.log(clickedPlaylist);
        if (clickedPlaylist.likedPlaylist) {
          clickedPlaylist.likeCount--;
        } else {
          clickedPlaylist.likeCount++;
        }

        let likeCount = document.getElementById(`like-count-${currentPlaylistID}`);
        likeCount.textContent = clickedPlaylist.likeCount;

        let heartImage = document.getElementById(`heart-${currentPlaylistID}`);
        heartImage.src = clickedPlaylist.likedPlaylist ? "/assets/img/white-heart.png" : "/assets/img/red-heart.png";

        clickedPlaylist.likedPlaylist = !clickedPlaylist.likedPlaylist;
    } else {
        const modalContainer = document.querySelector(".modal-playlist-header-container")
        const header = createModalHeader(clickedPlaylist);
        modalContainer.appendChild(header);

        const modalSongContainer = document.querySelector(".modal-songs-flex");
        for (const song of clickedPlaylist.songs) {
          const newSong = createModalSong(song);
          modalSongContainer.appendChild(newSong);
        }
        
        modal.style.display = 'block';
        
        const shuffleButton = document.querySelector('.shuffle');
          shuffleButton.addEventListener('click', () => {
          const currentPlaylist = playlists.find(playlist => playlist.id === currentPlaylistID);

          currentPlaylist.songs = shuffleArray(currentPlaylist.songs);

          const modalSongContainer = document.querySelector(".modal-songs-flex");
          modalSongContainer.innerHTML = '';
          for (const song of currentPlaylist.songs) {
            const newSong = createModalSong(song);
            modalSongContainer.appendChild(newSong);
          }
        });
    }
    })
  );

  modalOutside.addEventListener('click', () => {
    hide();
    let modalHeader = document.querySelector(".modal-playlist-header");
    modalHeader.remove();
    
    const modalSongs = document.querySelectorAll(".modal-song");
    for (let song of modalSongs) {
      song.remove();
    }
  });
  modalX.addEventListener('click', () => {
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
  };
  return array
}
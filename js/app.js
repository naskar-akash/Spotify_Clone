let currentSong = new Audio();
let songs;
let currFolder;

//function to convert seconds into min:sec format
function convertToMinutesSeconds(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// function to get the list of all songs
let getSongs = async (folder) => {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //to add all songs in the ul tag of library
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li><i class="fa-solid fa-music"></i>
                <div class="info">
                  <div>${song}</div>
                  <div>Unknown</div>
                </div>
                <div class="playNow">
                  <span>Play Now</span>
                  <i class="fa-solid fa-circle-play"></i>
                </div></li>`;
  }

  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  return songs;
};

//making the play music function
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;

  if (!pause) {
    currentSong.play();
  }
  play.src = "img/pause.svg";
  document.querySelector(".songInfo").innerHTML = decodeURI(
    track.split(".")[0]
  );
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
    if (e.href.includes("/songs/")) {

      let folder = e.href.split("/").slice(-1)[0];
      
      //get the metadata of the folders
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 40 40"
                  width="40"
                  height="40"
                  role="img"
                  aria-hidden="true"
                >
                  <!-- Circular green background -->
                  <circle cx="20" cy="20" r="20" fill="#1fdf64" />

                  <!-- Icon with padding and black fill -->
                  <g transform="translate(8, 8) scale(0.9)">
                    <path
                      d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
                      fill="black"
                    />
                  </g>
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
    }
  }
   //Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // songs = await getSongs(`songs/${item.dataset.folder}`)
      
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

let main = async () => {
  // list of all songs
  await getSongs(`songs/MohunBagan`);
  playMusic(songs[0], true);

  //display all albums on the page
  displayAlbums();

  //Attach an event listener with previos,play and next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  //event listener for time update
  currentSong.addEventListener("timeupdate", () => {
    
    document.querySelector(".songTime").innerHTML = `${convertToMinutesSeconds(
      currentSong.currentTime
    )}/${convertToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + `%`;
  });
  //add event listener to seekbar
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let per = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = per + `%`;
    currentSong.currentTime = (currentSong.duration * per) / 100;
  });
  //add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add event listener to the leftward key in the header of left box
  document.querySelector(".leftWard").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  // add event listener to previous and nexts
  document.querySelector("#previous").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  document.querySelector("#next").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  //add an event listener to volume key
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;

      window.onload = () => {
        const savedVol = localStorage.getItem(".volMsg");
        const volume = savedVol !== null ? parseFloat(savedVol) : 50;
      };
      document.querySelector(".volMsg").innerHTML = e.target.value;
    });
//Add eventlistener to volume button
document.querySelector(".volume>img").addEventListener("click",e=>{
  if (e.target.src.includes("volume.svg")) {
    e.target.src = e.target.src.replace("volume.svg","mute.svg");
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    document.querySelector(".volMsg").innerHTML= 0;
  } else {
    e.target.src = e.target.src.replace("mute.svg","volume.svg");
    currentSong.volume = .1;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    document.querySelector(".volMsg").innerHTML = 10;
  }
})
 
};

main();

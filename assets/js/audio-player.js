//audio player created in pain there are some problems with chromium browsers 


//Variables
var btn_playpause = document.querySelector(".playpause-track");
var btn_next = document.querySelector(".next-track");
var btn_prev = document.querySelector(".prev-track");

var slider_seek = document.querySelector(".slider_seek");
var slider_volume = document.querySelector(".slider_volume");

var track_playing = document.querySelector(".now-playing");
var track_name = document.querySelector(".track-name");
var track_artist = document.querySelector(".track-artist");

var current_time = document.querySelector(".current-time");
var total_duration = document.querySelector(".total-duration");
var current_track = document.querySelector("audio");

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audio = new Audio();

var source = audioCtx.createMediaElementSource(current_track);

source.connect(audioCtx.destination);

var track_index = 0;
var analyser_index = 0;
var isPlaying = false;
var isRandom = false;
var updateTimer;

const playlist = [
  {
    name: "Memories",
    artist: "Tomek Tomasik",
    music: "assets/sounds/Memories.mp3",
  },

  {
    name: "Change",
    artist: "Tomek Tomasik",
    music: "assets/sounds/Change.mp3",
  },
];


//Some functions
function downloadFile(track_index) {
  let filename, path;

  if (track_index === 1) {
    filename = "Change.mp3";
    path = "assets/sounds/";
  } else if (track_index === 0) {
    filename = "Memories.mp3";
    path = "assets/sounds/";
  }
  const fileUrl = path + filename;

  // Create a temporary anchor element
  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  downloadLink.download = filename;

  // Trigger the download
  downloadLink.click();
}

loadTrack(track_index);

function loadTrack(track_index) {
  clearInterval(updateTimer);
  reset();

  current_track.src = playlist[track_index].music;
  current_track.load();
  track_name.textContent = playlist[track_index].name;
  track_artist.textContent = playlist[track_index].artist;
  track_playing.textContent =
    "Tune " + (track_index + 1) + " of " + playlist.length;

  updateTimer = setInterval(setUpdate, 1000);

  current_track.addEventListener("ended", nextTrack);

  function populate(a) {
    for (var i = 0; i < 6; i++) {
      var x = Math.round(Math.random() * 14);
      var y = hex[x];
      a += y;
    }
    return a;
  }
}

function forcePlay() {
  if (event.target.id === "memories") {
    track_index = 0;
    loadTrack(track_index);
    playTrack();
  } else if (event.target.id === "change") {
    track_index = 1;
    loadTrack(track_index);
    playTrack();
  }
}

function reset() {
  current_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  slider_seek.value = 0;
}
function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}
function playRandom() {
  isRandom = true;
  randomIcon.classList.add("randomActive");
}
function pauseRandom() {
  isRandom = false;
  randomIcon.classList.remove("randomActive");
}
function repeatTrack() {
  var current_index = track_index;
  loadTrack(current_index);
  playTrack();
}
function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}
function playTrack() {
  current_track.play();
  isPlaying = true;
  btn_playpause.innerHTML = '<i class="fa fa-pause-circle fa-3x"></i>';
  draw_Analyser(analyser_index);
}
function pauseTrack() {
  current_track.pause();
  isPlaying = false;
  btn_playpause.innerHTML = '<i class="fa fa-play-circle fa-3x"></i>';
}
function nextTrack() {
  if (track_index < playlist.length - 1 && isRandom === false) {
    track_index += 1;
  } else if (track_index < playlist.length - 1 && isRandom === true) {
    var random_index = Number.parseInt(Math.random() * playlist.length);
    track_index = random_index;
  } else {
    track_index = 0;
  }
  loadTrack(track_index);
  playTrack();
}
function prevTrack() {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = playlist.length - 1;
  }
  loadTrack(track_index);
  playTrack();
}
function seekTo() {
  var seekto = current_track.duration * (slider_seek.value / 100);
  current_track.currentTime = seekto;
}
function setVolume() {
  current_track.volume = slider_volume.value / 100;
}
function setUpdate() {
  var seekPosition = 0;
  if (!isNaN(current_track.duration)) {
    seekPosition = current_track.currentTime * (100 / current_track.duration);
    slider_seek.value = seekPosition;

    var currentMinutes = Math.floor(current_track.currentTime / 60);
    var currentSeconds = Math.floor(
      current_track.currentTime - currentMinutes * 60
    );
    var durationMinutes = Math.floor(current_track.duration / 60);
    var durationSeconds = Math.floor(
      current_track.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    current_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

//Draing functions
function draw_Analyser() {
  if (analyser_index === 0) {
    drawBarsAnalyser();
  } else {
    drawOscAnalyser();
  }
}

function drawBarsAnalyser() {
  analyser_index = 0;
  var analyser = audioCtx.createAnalyser();

  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;
  var ctx = canvas.getContext("2d");

  source.connect(analyser);

  analyser.fftSize = 256;

  var bufferLength = analyser.frequencyBinCount;

  var dataArray = new Uint8Array(bufferLength);

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight = canvas.height;
  var x = 0;

  function draw() {
    requestAnimationFrame(draw);

    x = 0;

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      var r = (x / WIDTH) * 255;
      var g = 0;
      var b = 0;

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }
  draw();
}

function drawOscAnalyser() {
  analyser_index = 1;
  var analyser = audioCtx.createAnalyser();

  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;
  const ctx = canvas.getContext("2d");

  source.connect(analyser);

  analyser.fftSize = 2048;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(256, 0, 0)";

    ctx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
  draw();
}

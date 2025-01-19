// Variables
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
var current_track = new Audio(); // Use the new Audio object

var track_index = 0;
var analyser_index = 0;
var isPlaying = false;
var isRandom = false;
var updateTimer;

var playlist = [];

// Create audio context and analyser
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source = audioCtx.createMediaElementSource(current_track);
var analyser = audioCtx.createAnalyser();
var gainNode = audioCtx.createGain();  




// Connect the analyser to the destination
source.connect(analyser);
analyser.connect(gainNode);
gainNode.connect(audioCtx.destination);


// Fetch the playlist from the server



document.getElementById("recentPlaylistBtn").addEventListener("click", () => fetchPlaylist('recent'));
document.getElementById("allPlaylistBtn").addEventListener("click", () => fetchPlaylist('all'));
fetchPlaylist('recent');




analyser.connect(audioCtx.destination);


slider_volume.addEventListener("input", setGain);

function setAudioDefaultVolume() {
  gainNode.gain.setValueAtTime(-0.5, audioCtx.currentTime)
}

function setGain() {
  let gainValue = slider_volume.value / 100;
  gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime)
}

setAudioDefaultVolume();


function playpauseTrack() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  isPlaying ? pauseTrack() : playTrack();
}


document.getElementById("recentPlaylistBtn").addEventListener("click", () => fetchPlaylist('recent'));
document.getElementById("allPlaylistBtn").addEventListener("click", () => fetchPlaylist('all'));
fetchPlaylist('recent');

async function fetchPlaylist(directory) {
  try {
    const response = await fetch(`https://lastfmfiddler.tomektomasik.pl/playlist/${directory}`);
    playlist = await response.json();
    loadTrack(track_index);
    generateTrackButtons();
  } catch (error) {
    console.error('Error fetching playlist:', error);
  }
}

fetchPlaylist();

// Load and play the track
function loadTrack(track_index) {
  clearInterval(updateTimer);
  reset();

  current_track.src = playlist[track_index].music;
  current_track.crossOrigin = "anonymous";
  current_track.load();
  track_name.textContent = playlist[track_index].name;
  track_artist.textContent = playlist[track_index].artist;
  track_playing.textContent = `Tune ${track_index + 1} of ${playlist.length}`;

  updateTimer = setInterval(setUpdate, 1000);

  current_track.addEventListener("ended", nextTrack);
}

function forcePlay(event) {
  const trackId = event.target.id;
  track_index = playlist.findIndex(track => track.id === trackId);
  if (track_index !== -1) {
    loadTrack(track_index);
    playTrack();
  }
}

// Generate buttons for each track in the playlist
function generateTrackButtons() {
  const buttonsContainer = document.querySelector('.buttons-container');
  buttonsContainer.innerHTML = ''; 
  playlist.forEach(track => {
    const listItem = document.createElement('li'); 
    const button = document.createElement('button'); 

    button.id = track.id;
    button.textContent = track.name;
    button.className = 'listButton'; 
    button.ondblclick = forcePlay; 

    listItem.appendChild(button); 
    buttonsContainer.appendChild(listItem); 
  });
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
  drawAnalyser(analyser_index);
}

function pauseTrack() {
  current_track.pause();
  isPlaying = false;
  btn_playpause.innerHTML = '<i class="fa fa-play-circle fa-3x"></i>';
}

function nextTrack() {
  if (track_index < playlist.length - 1 && !isRandom) {
    track_index += 1;
  } else if (track_index < playlist.length - 1 && isRandom) {
    var random_index = Math.floor(Math.random() * playlist.length);
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

function setUpdate() {
  var seekPosition = 0;
  if (!isNaN(current_track.duration)) {
    seekPosition = current_track.currentTime * (100 / current_track.duration);
    slider_seek.value = seekPosition;

    var currentMinutes = Math.floor(current_track.currentTime / 60);
    var currentSeconds = Math.floor(current_track.currentTime - currentMinutes * 60);
    var durationMinutes = Math.floor(current_track.duration / 60);
    var durationSeconds = Math.floor(current_track.duration - durationMinutes * 60);

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

    current_time.textContent = `${currentMinutes}:${currentSeconds}`;
    total_duration.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

function downloadFile() {
  const currentTrackName = track_name.textContent;
  if (currentTrackName) {
      const link = document.createElement('a');
      link.href = `https://lastfmfiddler.tomektomasik.pl/download/all/${encodeURIComponent(currentTrackName)}.mp3`;
      link.download = `${currentTrackName}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  } else {
      console.error('No track is currently playing');
  }
}

const trackIndex = 0;


function drawAnalyser(index) {
  if (index === 0) {
    drawBarsAnalyser();
  } else {
    drawOscAnalyser();
  }
}
function drawAnalyser(index) {
  if (index === 0) {
    drawBarsAnalyser();
  } else {
    drawOscAnalyser();
  }
}

function drawBarsAnalyser() {
  analyser_index = 0;
  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  const barCount = 100; 
  var barWidth = WIDTH / barCount; 
  var barHeight;
  var x = 0;

  const nyquist = 44100 / 2; 
  const freqBinWidth = nyquist / bufferLength;

  // I'm not good at math :(
  function getFFTIndex(barIndex) {
    const logMinFreq = Math.log10(40);
    const logMaxFreq = Math.log10(nyquist);
    const logRange = logMaxFreq - logMinFreq;
    const logFreq = logMinFreq + (barIndex / barCount) * logRange;
    const freq = Math.pow(10, logFreq);
    return Math.round(freq / freqBinWidth);
  }

  function draw() {
    requestAnimationFrame(draw);
    x = 0;
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
   
    const scaleFactor = 0.4; 
  
    for (var i = 0; i < barCount; i++) {
      const fftIndex = getFFTIndex(i);
      const dataValue =
        fftIndex < bufferLength
          ? (dataArray[fftIndex] +
              (dataArray[fftIndex - 1] || dataArray[fftIndex]) +
              (dataArray[fftIndex + 1] || dataArray[fftIndex])) /
            2
          : 0;
      
      // Adjust bar height
      barHeight = dataValue * (HEIGHT / 255) * scaleFactor;
      
      const r = (x / WIDTH) * 255;
      const g = 0;
      const b = 55 - r;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
  
      x += barWidth;
    }
  }
  draw();
}



function drawOscAnalyser() {
  analyser_index = 1;
  analyser.fftSize = 2048;
  var bufferLength = analyser.fftSize;
  var dataArray = new Uint8Array(bufferLength);

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(256, 0, 0)";

    ctx.beginPath();

    var sliceWidth = (canvas.width * 1.0) / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * canvas.height) / 2;

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




var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';


function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); 
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.addEventListener('touchmove', preventDefault, wheelOpt); 
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}


function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}


let isScrollEnabled = true;

function toggleScroll() {
    if (isScrollEnabled) {
        disableScroll();
    } else {
        enableScroll();
    }
    isScrollEnabled = !isScrollEnabled;
}


const toggleButton = document.getElementById('scrollButton');
toggleButton.addEventListener('click', toggleScroll);



async function playTrackFromServer(trackName) {
  try {
    const trackUrl = `https://lastfmfiddler.tomektomasik.pl/all/${encodeURIComponent(trackName)}.mp3`;
    current_track.src = trackUrl;
    current_track.crossOrigin = "anonymous";
    current_track.load();
    track_name.textContent = trackName;
    track_artist.textContent = "Tomek Tomasik";
    track_playing.textContent = `Playing: ${trackName}`;
    playTrack();
  } catch (error) {
    console.error('Error fetching and playing track:', error);
  }
  }


function playTrackFromServer(trackName) {
  const trackUrl = `https://lastfmfiddler.tomektomasik.pl/all/${encodeURIComponent(trackName)}.mp3`;
  current_track.src = trackUrl;
  current_track.crossOrigin = "anonymous";
  current_track.load();
  track_name.textContent = trackName;
  track_artist.textContent = "Tomek Tomasik";
  track_playing.textContent = `Playing: ${trackName}`;
  playTrack();
}

// EQ 

function toggleEqualizer() {
  const equalizer = document.querySelector('.equalizer');
  const minfo = document.querySelector('.minfo'); 

  equalizer.classList.toggle('active');

  if (equalizer.classList.contains('active')) {
    minfo.style.marginTop = "200px"; 
  } else {
    minfo.style.marginTop = "0px"; 
  }
}

// create funtion to hide EQ when windows width is less than 1400. This feature is not meant to be used on small screens.
function handleResize() {
  const equalizer = document.querySelector('.equalizer');
  const minfo = document.querySelector('.minfo');
  
  if (window.innerWidth < 1400) {
    equalizer.classList.remove('active');
    minfo.style.marginTop = "0px"; 
  }
}

window.addEventListener('resize', handleResize);

handleResize();


// Filters (I need to play with them a little bit more)

var eqSettings = [
  { freq: 125, type: "lowshelf", Q: 0.100 }, 
  { freq: 250, type: "peaking", Q: 0.1 },   
  { freq: 500, type: "peaking", Q: 0.3 },   
  { freq: 1000, type: "peaking", Q: 0.3 },  
  { freq: 1500, type: "peaking", Q: 0.5 }, 
  { freq: 2000, type: "peaking", Q: 0.5 },   
  { freq: 4000, type: "peaking", Q: 0.5 }, 
  { freq: 5500, type: "peaking", Q: 0.2 },   
  { freq: 8000, type: "peaking", Q: 0.1 },  
  { freq: 16000, type: "highshelf", Q: 2.707 } 
];
setFilterValue  = function() {
};

var filters = eqSettings.map(function(setting) {
  var filter = audioCtx.createBiquadFilter();
  filter.type = setting.type;
  filter.frequency.value = setting.freq;
 
  return filter;
});


filters.reduce(function(prev, curr) {
  prev.connect(curr);
  return curr;
}, source).connect(analyser);


filters.forEach(function(filter, index) {
  document.getElementById("eq-" + eqSettings[index].freq).addEventListener("input", function() {
    filter.gain.value = this.value;
  });
});


document.addEventListener("DOMContentLoaded", function() {
  const sliders = document.querySelectorAll(".slider");


  const initialValues = {};
  sliders.forEach(slider => {
    initialValues[slider.id] = slider.value;
  });

  function updateFilter(slider) {
    const frequency = slider.id.split('-')[1]; 
    const value = parseFloat(slider.value); 
    const filterIndex = filters.findIndex(filter => 
      filter.frequency.value === parseFloat(frequency)
    );

    if (filterIndex !== -1) {
      filters[filterIndex].gain.value = value; 
    }
  }

  
  sliders.forEach((slider) => {
   
    const currentValue = document.createElement("valg");
    currentValue.textContent = slider.value;
    slider.parentNode.appendChild(currentValue);

   
    slider.addEventListener("input", function() {
      currentValue.textContent = slider.value;
      updateFilter(slider);
    });

 
    slider.addEventListener("dblclick", function() {
      const initialValue = initialValues[slider.id];
      slider.value = initialValue;
      currentValue.textContent = initialValue;
      updateFilter(slider);
    });
  });


  function resetEq() {
    sliders.forEach(slider => {
      const initialValue = initialValues[slider.id];
      slider.value = initialValue;
      
 
      const currentValue = slider.parentNode.querySelector("valg");
      if (currentValue) {
        currentValue.textContent = initialValue;
      }

      updateFilter(slider); 
    });
  }

 
  document.getElementById("resetequalizerbtn").addEventListener("click", resetEq);
});

console.log("Current track:", current_track);
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

// Connect the analyser to the destination
source.connect(analyser);
analyser.connect(audioCtx.destination);

// Fetch the playlist from the server


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

function setVolume() {
  current_track.volume = slider_volume.value / 100;
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

// Ensure volume is set correctly on load
current_track.volume = slider_volume.value / 100;



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


// Drawing functions
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

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
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



    // Function to toggle scrolling
    

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
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

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
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





//node tree

var margin = {
  top: 20,
  right: 120,
  bottom: 20,
  left: 120
},
width = 960 - margin.right - margin.left,
baseHeight = 200 - margin.top - margin.bottom;

var i = 0,
duration = 500,
root;

var tree = d3.layout.tree()
.size([baseHeight, width]);

var diagonal = d3.svg.diagonal()
.projection(function(d) {
  return [d.y, d.x];
});

var svg = d3.select("#tree-container").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", baseHeight + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("/assets/music.json", function(error, genre) {
  if (error) throw error;

  root = genre;
  root.x0 = baseHeight / 2;
  root.y0 = 0;

  function collapseAll(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapseAll);
      d.children = null;
    }
  }

  collapseAll(root);
  centerNode(root); 
  update(root);
});

d3.select(self.frameElement).style("height", "1000px");

function update(source) {
centerNode(source);

var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

var node = svg.selectAll("g.node")
  .data(nodes, function(d) {
    return d.id || (d.id = ++i);
  });

var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .attr("transform", function(d) {
    return "translate(" + source.y0 + "," + source.x0 + ")";
  })
  .on("click", click);

nodeEnter.append("rect")
  .attr("class", "node-bg")
  .attr("y", -15)
  .attr("x", function(d) {
    return d === root ? -60 : -5;
  })
  .attr("width", 10)
  .attr("height", 30)
  .attr("rx", 10)
  .attr("ry", 10)
  .style("fill", function(d) {
    return d.children || d._children ? "#f0f0f0" : "#000000";
  })
  .style("stroke", function(d) {
    return d.children || d._children ? "#f0f0f0" : "#000000";
  })
  .style("stroke-width", 1);

  nodeEnter.append("text")
  .attr("dy", ".35em")
  .style("fill", function(d) {
    return d.children || d._children ? "#000000" : "#ffffff";
  })
  .attr("x", function(d) {
    return d === root ? -15 : 0;
  })
  .attr("text-anchor", function(d) {
    return d === root ? "end" : "start";
  })
  .text(function(d) {

    return d.name + ((!d.children && !d._children) ? " ►" : "");
  })
  .style("fill-opacity", 1e-6);

var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function(d) {
    return "translate(" + d.y + "," + d.x + ")";
  });

nodeUpdate.select("rect")
  .attr("width", function(d) {
    var textLength = this.parentNode.querySelector("text").getComputedTextLength();
    return d === root ? Math.max(60, textLength + 10) : Math.max(20, textLength + 10);
  })
  .style("fill", function(d) {
    return d.children || d._children ? "#f0f0f0" : "#000000";
  })
  .style("stroke", function(d) {
    return d.children || d._children ? "#f0f0f0" : "#000000";
  });

nodeUpdate.select("text")
  .style("fill-opacity", 1);

var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function(d) {
    return "translate(" + source.y + "," + source.x + ")";
  })
  .remove();

nodeExit.select("rect")
  .attr("width", 1e-6);

nodeExit.select("text")
  .style("fill-opacity", 1e-6);

var link = svg.selectAll("path.link")
  .data(links, function(d) {
    return d.target.id;
  });

link.enter().insert("path", "g")
  .attr("class", "link")
  .attr("d", function(d) {
    var o = {
      x: source.x0,
      y: source.y0
    };
    return diagonal({
      source: o,
      target: o
    });
  });

link.transition()
  .duration(duration)
  .attr("d", diagonal);

link.exit().transition()
  .duration(duration)
  .attr("d", function(d) {
    var o = {
      x: source.x,
      y: source.y
    };
    return diagonal({
      source: o,
      target: o
    });
  })
  .remove();

nodes.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
});

// count number of expanded nodes to calculate new height
var expandedNodesCount = nodes.filter(function(d) {
  return d.children && d.children.length > 0;
}).length;

var newHeight = baseHeight + expandedNodesCount * 70 - 50;
tree.size([newHeight, width]);

d3.select("svg").transition().duration(duration)
  .attr("height", newHeight + margin.top + margin.bottom);

svg.transition().duration(duration)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function click(d) {
if (d.children) {
  d._children = d.children;
  d.children = null;
} else if (d._children) {
  d.children = d._children;
  d._children = null;
} else {
  playTrackFromServer(d.name);
  return; 
}

update(d);
}


function centerNode(source) {
var nodes = tree.nodes(root);
var height = Math.max(100, nodes.length * 30);
var depth = Math.max.apply(Math, nodes.map(function(d) { return d.depth; }));
var newHeight = Math.max(baseHeight, height);

tree.size([newHeight, width]);

var scale = newHeight / height;
nodes.forEach(function(d) {
  d.y = d.depth * 180;
  d.x = (d.x * scale) + (newHeight - height * scale) / 2;
});

// SVG height update
d3.select("svg").transition().duration(duration)
  .attr("height", newHeight + margin.top + margin.bottom);

svg.transition().duration(duration)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}
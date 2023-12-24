let data, analyzer, sampleRate;
const fftSize = 2**15;
const $canvas = window.canvas;
const $note = window.note;
const $freq = window.freq;
const $button = window.record;
const $pointer = window.pointer;


async function getMedia(constraints) {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch(_) {
    return null;
  }
}

function initEventListeners() {
  $button.addEventListener('click', init);
}

function closestNote(freq) {
  return notes
    .map((item) => ({ ...item, diff: freq - item.freq }))
    .sort((a, b) => (Math.abs(a.diff) - Math.abs(b.diff)))[0];
}

function diffToDeg(val) {
  let diff = val;
  if (diff > 40) {
    diff = 40;
  }
  if (diff < -40) {
    diff = -40;
  }
  return diff * 3; // 120 => 360
}

function closestNotes(freq) {
  const sortedNotes = notes
    .map((item) => ({ ...item, diff: freq - item.freq }))
    .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));

  const currentIndex = sortedNotes.findIndex((item) => item.diff === 0);
  const prevNote = sortedNotes[currentIndex - 1];
  const currentNote = sortedNotes[currentIndex];
  const nextNote = sortedNotes[currentIndex + 1];

  return { prevNote, currentNote, nextNote };
}


function getHighestFrequency() {
  const largest = Array.from(data)
    .map((val, idx) => ({
      val, idx, freq: idx * sampleRate / fftSize,
    }))
    .sort((a, b) => b.val - a.val)[0];

  const found = closestNote(largest.freq);
  $note.innerHTML = found.note;
  $freq.innerHTML = `${largest.freq.toFixed(2)} Hz`;
  
  const deg = diffToDeg(found.diff);
  $pointer.style.transform = `rotate(${deg}deg) translate(-50%, -50%)`;
  
  return largest;
}


function read() {
  analyser.getByteFrequencyData(data);
  const largest = getHighestFrequency();
  // debug(largest);

  window.requestAnimationFrame(read);
}

async function init() {
  $button.innerText = 'comparing...';

  const ctx = new AudioContext();
  sampleRate = ctx.sampleRate; // 44100
  analyser = ctx.createAnalyser();
  const stream = await getMedia({ audio: true });
  const source = ctx.createMediaStreamSource(stream);
  source.connect(analyser);

  analyser.fftSize = fftSize;
  data = new Uint8Array(analyser.frequencyBinCount)

  read();
}

window.onload = initEventListeners;


const notes = [];

// Notes range from C0 to B8
for (let octave = 0; octave <= 8; octave++) {
  const octaveBaseFrequency = 16.35 * Math.pow(2, octave);
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  for (const noteName of noteNames) {
    const note = {
      note: `${noteName}${octave}`,
      freq: octaveBaseFrequency * Math.pow(2, noteNames.indexOf(noteName) / 12)
    };

    notes.push(note);
  }
}

console.log(notes); 




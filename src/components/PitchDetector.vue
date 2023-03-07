<template>
  <div>
    <h1>Reconnaissance de notes</h1>
    <button @click="startRecording" v-bind:disabled="isRecording">
      Commencer l'enregistrement
    </button>
    <button @click="stopRecording" v-bind:disabled="!isRecording">
      Arrêter l'enregistrement
    </button>
    <select v-model="pitchFinder">
      <option v-for="detector in detectors" :value="detector">
        {{ detector.name }}
      </option>
    </select>
    <p>Note jouée :</p>
    <h2>{{ note }}</h2>
  </div>
</template>

<script>
import * as PitchFinder from "pitchfinder";
// import ml5 from "ml5";

const REFERENCE_FREQUENCIES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export default {
  data() {
    return {
      audioStream: null,
      audioContext: null, // new AudioContext(),
      detectors: [
        PitchFinder.YIN(),
        PitchFinder.AMDF(),
        PitchFinder.DynamicWavelet(),
        // this.crepe,
      ],
      pitchFinder: PitchFinder.YIN(),
      isRecording: false,
      note: null,
      crepePitch: null,
    };
  },
  methods: {
    startRecording() {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            mandatory: {
              googEchoCancellation: "false",
              googAutoGainControl: "false",
              googNoiseSuppression: "false",
              googHighpassFilter: "false",
            },
            optional: [],
          },
        })
        .then((stream) => {
          this.audioContext = new AudioContext();
          this.audioStream = stream;

          // this.initCrepe();

          const analyser = this.audioContext.createAnalyser();
          const source = this.audioContext.createMediaStreamSource(stream);

          source.connect(analyser);

          this.isRecording = true;

          setInterval(() => {
            if (!this.isRecording) return;

            console.log("pitchFinder: ", this.pitchFinder.name);

            const inputBuffer = new Float32Array(2048);

            analyser.getFloatTimeDomainData(inputBuffer);

            const pitch = this.pitchFinder(inputBuffer);

            // var pitches = this.detectors.map((detector) =>
            //   detector(inputBuffer)
            // );

            // // Remove null values
            // pitches = pitches.filter((pitch) => pitch);

            // // Remove impossible values
            // pitches = pitches.filter(
            //   (pitch) => pitch && pitch >= 16.35 && pitch <= 7902.13
            // );

            // // Get the mean of the pitches
            // const pitch = pitches.reduce((a, b) => a + b, 0) / pitches.length;

            console.log(pitch);

            if (pitch) {
              this.note = pitchToNote(pitch);
            } else {
              this.note = "-";
            }
          }, 1000 / 20);
        })
        .catch((err) => console.error(err));
    },
    stopRecording() {
      this.isRecording = false;
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.note = null;
    },

    initCrepe() {
      // this.crepePitch = ml5.pitchDetection("/model", this.audioContext, this.audioStream, null);
    },
    
    crepe(buf, sampleRate) {
      this.crepePitch.getPitch((err, frequency) => {
        console.log("Frequency", frequency);
      });
      return 0;
      // return await this.crepePitch.getPitch();
    },
  },
  mounted() {
    // this.initCrepe();
  },
};

function pitchToNote(pitch) {
  // const octave = Math.floor(pitch / 12) - 1;

  const midiNum = freqToMidi(pitch);
  const currentNote = REFERENCE_FREQUENCIES[midiNum % 12];

  // return `${currentNote} ${octave} cents`;
  return `${currentNote}`;
}

// taken from p5.Sound
function freqToMidi(f) {
  const mathlog2 = Math.log(f / 440) / Math.log(2);
  const m = Math.round(12 * mathlog2) + 69;
  return m;
}

function autoCorrelate(buf, sampleRate) {
  // Implements the ACF2+ algorithm
  var SIZE = buf.length;
  var rms = 0;

  for (var i = 0; i < SIZE; i++) {
    var val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01)
    // not enough signal
    return -1;

  var r1 = 0,
    r2 = SIZE - 1,
    thres = 0.2;
  for (var i = 0; i < SIZE / 2; i++)
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  for (var i = 1; i < SIZE / 2; i++)
    if (Math.abs(buf[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  var c = new Array(SIZE).fill(0);
  for (var i = 0; i < SIZE; i++)
    for (var j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i];

  var d = 0;
  while (c[d] > c[d + 1]) d++;
  var maxval = -1,
    maxpos = -1;
  for (var i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  var T0 = maxpos;

  var x1 = c[T0 - 1],
    x2 = c[T0],
    x3 = c[T0 + 1];
  a = (x1 + x3 - 2 * x2) / 2;
  b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}
</script>

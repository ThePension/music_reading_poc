<template>
  <div class="q-pa-md">
    <h4 class="q-my-lg">Reconnaissance de notes</h4>
    <q-btn @click="startRecording" class="q-ma-md" v-bind:disable="isRecording" style="background: #FFFFFF; color: black"
      label="Commencer la détection" />
    <q-btn @click="stopRecording" v-bind:disable="!isRecording" class="q-ma-md" style="background: #FFFFFF; color: black"
      label="Arrêter la détection" />

    <div class="q-pa-md">
      <q-option-group :options="detectors" type="radio" v-model="pitchFinder" />
    </div>

    <h5>Note jouée :</h5>
    <h2 class="text-h2 text-center">{{ note }}</h2>
    <!-- Display pitch with 2 decimal if pitch is a number -->
    <h5>Fréquence : {{ typeof pitch === "number" ? pitch.toFixed(2) : pitch }}</h5>
    <h5>N° MIDI : {{ midiNum }}</h5>
  </div>
</template>

<script>
import * as PitchFinder from "pitchfinder";
import ml5 from "ml5";

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
      pitchFinder: PitchFinder.YIN(),
      detectors: [
        {
          "label": "YIN",
          "value": PitchFinder.YIN()
        },
        {
          "label": "AMDF",
          "value": PitchFinder.AMDF()
        },
        {
          "label": "DynamicWavelet",
          "value": PitchFinder.DynamicWavelet()
        },
        {
          "label": "FftAutoCorrelation",
          "value": this.autoCorrelate
        },
        {
          "label": "CREPE",
          "value": this.crepe
        }
      ],
      isRecording: false,
      note: "-",
      pitch: "-",
      midiNum: "-",
      crepePitch: null,
      sampleRate: 0,
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

          this.sampleRate = this.audioContext.sampleRate;

          this.initCrepe();

          const analyser = this.audioContext.createAnalyser();
          const source = this.audioContext.createMediaStreamSource(stream);

          source.connect(analyser);

          this.isRecording = true;

          setInterval(() => {
            if (!this.isRecording) return;

            const inputBuffer = new Float32Array(2048);

            analyser.getFloatTimeDomainData(inputBuffer);

            this.pitch = this.pitchFinder(inputBuffer);

            console.log(this.pitch);

            this.updateUi();
          }, 1000 / 20);
        })
        .catch((err) => console.error(err));
    },

    /**
     * Stop recording
     */
    stopRecording() {
      this.isRecording = false;
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.note = "-";
    },

    initCrepe() {
      this.crepePitch = ml5.pitchDetection("/model", this.audioContext, this.audioStream, null);
    },

    crepe() {
      this.crepePitch.getPitch((err, frequency) => {
        this.pitch = frequency;
        this.updateUi();
      });
    },

    updateUi() {
      if (this.pitch && this.pitch >= 16.35 && this.pitch <= 7902.13) {
        // Get the MIDI number
        this.midiNum = freqToMidi(this.pitch);

        // Get the note name
        this.note = midiToNote(this.midiNum);
      } else {
        this.note = "-";
        this.pitch = "-";
        this.midiNum = "-";
      }
    },

    // Based on : https://github.com/cwilso/PitchDetect
    autoCorrelate(buf) {
      // Implements the ACF2+ algorithm
      var SIZE = buf.length;
      var rms = 0;

      for (var i = 0; i < SIZE; i++) {
        var val = buf[i];
        rms += val * val;
      }
      rms = Math.sqrt(rms / SIZE);
      if (rms < 0.01) // not enough signal
        return -1;

      var r1 = 0, r2 = SIZE - 1, thres = 0.2;
      for (var i = 0; i < SIZE / 2; i++)
        if (Math.abs(buf[i]) < thres) { r1 = i; break; }
      for (var i = 1; i < SIZE / 2; i++)
        if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

      buf = buf.slice(r1, r2);
      SIZE = buf.length;

      var c = new Array(SIZE).fill(0);
      for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE - i; j++)
          c[i] = c[i] + buf[j] * buf[j + i];

      var d = 0; while (c[d] > c[d + 1]) d++;
      var maxval = -1, maxpos = -1;
      for (var i = d; i < SIZE; i++) {
        if (c[i] > maxval) {
          maxval = c[i];
          maxpos = i;
        }
      }
      var T0 = maxpos;

      var x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
      var a = (x1 + x3 - 2 * x2) / 2;
      var b = (x3 - x1) / 2;
      if (a) T0 = T0 - b / (2 * a);

      return this.sampleRate / T0;
    }
  },
  mounted() {
    // this.initCrepe();
  },
};

function midiToNote(midiNum) {
  return REFERENCE_FREQUENCIES[midiNum % 12];
}

// taken from p5.Sound
function freqToMidi(f) {
  const mathlog2 = Math.log(f / 440) / Math.log(2);
  const m = Math.round(12 * mathlog2) + 69;
  return m;
}


</script>

<template>
  <div>
    <h1>Reconnaissance de notes</h1>
    <button @click="startRecording">Commencer l'enregistrement</button>
    <button @click="stopRecording">Arrêter l'enregistrement</button>
    <p>Note jouée : {{ note }}</p>
  </div>
</template>

<script>
import * as PitchFinder from "pitchfinder";

export default {
  data() {
    return {
      audioStream: null,
      pitchFinder: PitchFinder.AMDF(),
      isRecording: false,
      note: null,
    };
  },
  methods: {
    startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          this.audioStream = stream;
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);

          source.connect(analyser);

          this.isRecording = true;

          setInterval(() => {
            if (!this.isRecording) return;

            const inputBuffer = new Float32Array(2048);

            analyser.getFloatTimeDomainData(inputBuffer);

            // console.log(inputBuffer);

            const pitch = this.pitchFinder(inputBuffer);

            console.log(pitch);
          }, 1000 / 60);
        })
        .catch((err) => console.error(err));
    },
    stopRecording() {
      this.isRecording = false;
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.note = null;
    },
  },
};

function pitchToNote (pitch) {
  const noteNames = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const octave = Math.floor(pitch / 12) - 1;
  const noteName = noteNames[pitch % 12];
  return `${noteName}${octave}`;
}
</script>

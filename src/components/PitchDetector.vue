<script setup>
import * as Pitchfinder from "pitchfinder";
import { ref, onMounted, onUnmounted } from "vue";

const audioContext = ref(null);

onMounted(() => {
  audioContext.value = new AudioContext();
});

onUnmounted(() => {
  audioContext.value.close();
});

const audioInput = ref(null);


const getPitch = () => {
  const pitch = Pitchfinder.AMDF();
  const buffer = audioInput.value.buffer.getChannelData(0);
  const pitchValue = pitch(buffer);
  console.log(pitchValue);
};

const startRecording = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      audioInput.value = audioContext.value.createMediaStreamSource(stream);
      const bufferSize = 2048;
      const recorder = audioContext.value.createScriptProcessor(
        bufferSize,
        1,
        1
      );
      audioInput.value.connect(recorder);
      recorder.connect(audioContext.value.destination);
      recorder.onaudioprocess = getPitch;
    })
    .catch((err) => {
      console.log(err);
    });
};

const stopRecording = () => {
  audioInput.value.disconnect();
  audioContext.value.close();
};

startRecording();

</script>

<template>
  <h1>hello</h1>
</template>

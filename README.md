#  music_reading_poc

Ce POC (Proof Of Concept) a pour objectifs de :
* Tester la récupération du flux audio à partir d'un navigateur web, en utilisant la [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* Tester les alternatives de détection de notes, à partir d'un flux audio, notamment :
  *  pour récupérer le flux audio
  * [CREPE (A Convolutional Representation for Pitch Estimation)](https://github.com/marl/crepe)
  * [Différents algorithmes de détection de fréquences](https://github.com/peterkhayes/pitchfinder), dont :
    * YIN,
    * AMDF,
    * Autocorrélation

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

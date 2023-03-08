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

Pour réaliser ce mini-projet, les technologies suivantes ont été utilisées :
* Vue, avec Vite
* Quasar
* Vercel pour le déploiement

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

## Sources
### Vite/Vue
* Mise en place d'un projet vite : https://vitejs.dev/guide/
* PWA avec vite/vue : https://vite-pwa-org.netlify.app/guide/

### Quasar
* Integration de Quasar dans un projet vite/vue : https://quasar.dev/start/vite-plugin
* Documentation officielle de Quasar pour les components

### Deployment
* Vercel CLI : https://vercel.com/docs/cli
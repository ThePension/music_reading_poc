<template>
  <div class="about">
    <h3 class="q-my-lg">À propos de ce projet</h3>

    <p>Ce POC (Proof Of Concept) a pour objectifs de :</p>
    <ul>
      <li>
        Tester la récupération du flux audio à partir d'un navigateur web, en
        utilisant la
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"
          >Web Audio API</a
        >
      </li>
      <li>
        Tester les alternatives de détection de notes, à partir d'un flux audio,
        notamment :
      </li>
      <ul>
        <li>pour récupérer le flux audio</li>
        <li>
          <a href="https://github.com/marl/crepe">
            CREPE (A Convolutional Representation for Pitch Estimation)
            </a>
        </li>
        <li>
          <a href="https://github.com/peterkhayes/pitchfinder">
            Différents algorithmes de détection de fréquences
          </a>
          , dont :
        </li>
        <ul>
          <li>YIN,</li>
          <li>AMDF,</li>
          <li>Autocorrélation</li>
        </ul>
      </ul>
    </ul>
    <p class="q-mt-md">
      Pour réaliser ce mini-projet, les technologies suivantes ont été utilisées :
    </p>
    <ul>
      <li>Vue, avec Vite</li>
      <li>Quasar</li>
      <li>Vercel pour le déploiement</li>
    </ul>
  </div>
</template>

<!-- <style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style> -->

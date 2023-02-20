
// Éléments du DOM
const noteDisplay = document.getElementById('note-display');

function autoCorrelate(buf, sampleRate) {
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
    a = (x1 + x3 - 2 * x2) / 2;
    b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
}

// Liste de fréquences de référence pour les notes de la gamme
const REFERENCE_FREQUENCIES = {
    'C0': 16.35,
    'C#0': 17.32,
    'D0': 18.35,
    'D#0': 19.45,
    'E0': 20.60,
    'F0': 21.83,
    'F#0': 23.12,
    'G0': 24.50,
    'G#0': 25.96,
    'A0': 27.50,
    'A#0': 29.14,
    'B0': 30.87,
    'C1': 32.70,
    'C#1': 34.65,
    'D1': 36.71,
    'D#1': 38.89,
    'E1': 41.20,
    'F1': 43.65,
    'F#1': 46.25,
    'G1': 49.00,
    'G#1': 51.91,
    'A1': 55.00,
    'A#1': 58.27,
    'B1': 61.74,
    'C2': 65.41,
    'C#2': 69.30,
    'D2': 73.42,
    'D#2': 77.78,
    'E2': 82.41,
    'F2': 87.31,
    'F#2': 92.50,
    'G2': 98.00,
    'G#2': 103.83,
    'A2': 110.00,
    'A#2': 116.54,
    'B2': 123.47,
    'C3': 130.81,
    'C#3': 138.59,
    'D3': 146.83,
    'D#3': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'F#3': 185.00,
    'G3': 196.00,
    'G#3': 207.65,
    'A3': 220.00,
    'A#3': 233.08,
    'B3': 246.94,
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25,
    'C#5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'E5': 659.25,
    'F5': 698.46,
    'F#5': 739.99,
    'G5': 783.99,
    'G#5': 830.61,
    'A5': 880.00,
    'A#5': 932.33,
    'B5': 987.77,
    'C6': 1046.50,
    'C#6': 1108.73,
    'D6': 1174.66,
    'D#6': 1244.51,
    'E6': 1318.51,
    'F6': 1396.91,
    'F#6': 1479.98,
    'G6': 1567.98,
    'G#6': 1661.22,
    'A6': 1760.00,
    'A#6': 1864.66,
    'B6': 1975.53,
    'C7': 2093.00,
    'C#7': 2217.46,
    'D7': 2349.32,
    'D#7': 2489.02,
    'E7': 2637.02,
    'F7': 2793.83,
    'F#7': 2959.96,
    'G7': 3135.96,
    'G#7': 3322.44,
    'A7': 3520.00,
    'A#7': 3729.31,
    'B7': 3951.07,
    'C8': 4186.01,
    'C#8': 4434.92,
    'D8': 4698.63,
    'D#8': 4978.03,
    'E8': 5274.04,
    'F8': 5587.65,
    'F#8': 5919.91,
    'G8': 6271.93,
    'G#8': 6644.88,
    'A8': 7040.00,
    'A#8': 7458.62,
    'B8': 7902.13,
};

// Fonction pour calculer la note la plus proche d'une fréquence donnée
function getClosestNoteName(frequency) {
    let closestFrequency = null;
    let closestNoteName = null;
    let smallestDifference = Infinity;
    for (let noteName in REFERENCE_FREQUENCIES) {
        let referenceFrequency = REFERENCE_FREQUENCIES[noteName];
        let difference = Math.abs(frequency - referenceFrequency);
        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestNoteName = noteName;
            closestFrequency = referenceFrequency;
        }
    }
    // return { noteName: closestNoteName, frequency: closestFrequency };
    return closestNoteName;
}

// Fonction de rappel exécutée pour chaque analyse de fréquence
function processFrequencyData(data) {
    // Calcul de la fréquence fondamentale
    let fundamentalFrequency = meyda.get('amplitudeSpectrum').indexOf(Math.max(...meyda.get('amplitudeSpectrum'))) * (MEYDA_SAMPLE_RATE / MEYDA_BUFFER_SIZE);

    // Calcul de la note la plus proche de la fréquence fondamentale
    let closestNote = getClosestNoteName(fundamentalFrequency);

    // Affichage de la note
    noteDisplay.textContent = closestNote.noteName;
}

// Fonction d'initialisation de l'entrée audio
async function initAudio() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // const audioContext = new AudioContext();
        // sourceNode = audioContext.createBufferSource();
        // sourceNode.buffer = theBuffer;
        // sourceNode.loop = true;

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        stream.connect( analyser );
        analyser.connect( audioContext.destination );
        sourceNode.start( 0 );

        // Boucle pour mettre à jour l'affichage de la note jouée
        setInterval(() => {
            const pitch = autoCorrelate(analyser);
            const note = getClosestNoteName(pitch);
            displayNotePlayed(note);
        }, 50);
    } catch (error) {
        console.error("Erreur lors de l'initialisation de l'audio :", error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initAudio();
});
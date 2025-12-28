// Utility to play a beep sound using Web Audio API
export const playSuccessBeep = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // High pitch beep similar to EVM (approx 2000-2500Hz)
        oscillator.type = 'square'; // Square wave gives a "buzzer" like tone
        oscillator.frequency.value = 2000;

        // Sound duration
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0.1, now); // Volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5); // Fade out over 1.5 seconds

        oscillator.start(now);
        oscillator.stop(now + 1.5); // Stop after 1.5 seconds (long beep)
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export const playVoteSuccessAudio = (language = 'en') => {
    try {
        // Map language codes to file suffixes or full filenames
        // Assuming files are in /public/audio/
        const audioMap = {
            mr: '/audio/vote_mr.mp3',
            hi: '/audio/vote_hi.mp3',
            en: '/audio/vote_en.mp3'
        };

        const file = audioMap[language] || audioMap['en'];

        console.log(`Attempting to play audio: ${file} for language: ${language}`);

        // Create an Audio object with full path
        const audio = new Audio(`${window.location.origin}${file}`);

        // Play
        audio.play().catch(e => console.error("Error playing voice audio:", e));

    } catch (e) {
        console.error("Audio playback error:", e);
    }
};

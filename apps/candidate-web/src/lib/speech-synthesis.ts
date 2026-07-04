export function speak(text: string, onEnd?: () => void) {
  const synth = window.speechSynthesis;

  if (synth.speaking) {
    synth.cancel();
  }

  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.rate = 0.92;
  utterThis.pitch = 0.98;
  utterThis.volume = 1.0;
  utterThis.lang = "en-US";
  utterThis.voice = synth.getVoices()[182] || synth.getVoices()[0];

  if (onEnd) {
    utterThis.onend = () => {
      onEnd();
    };
  }

  synth.speak(utterThis);
}

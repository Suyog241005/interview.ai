export function speak(text: string) {
  const synth = window.speechSynthesis;

  if (synth.speaking) {
    console.error(
      "SpeechSynthesis.speaking property set to 'true' before calling speak() again.",
    );
    return;
  }

  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.rate = 0.92;
  utterThis.pitch = 0.98;
  utterThis.volume = 1.0;
  utterThis.lang = "en-US";
  utterThis.voice = synth.getVoices()[182];

  synth.speak(utterThis);
}

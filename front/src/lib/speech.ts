export function speakName(name: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Cancela cualquier locución en curso
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(
    `Bienvenido ${name.replace(/_/g, " ")}`
  );

  // Intenta escoger una voz en español
  const voices = window.speechSynthesis.getVoices();
  const mx =
    voices.find((v) => v.lang === "es-MX") || // Chrome normalmente trae “Google español de México”
    voices.find((v) => v.lang.startsWith("es")); // cualquier español
  if (mx) utter.voice = mx;

  utter.rate = 1.0; // velocidad (0.1 – 10)
  utter.pitch = 1.0; // tono (0 – 2)
  window.speechSynthesis.speak(utter);
}

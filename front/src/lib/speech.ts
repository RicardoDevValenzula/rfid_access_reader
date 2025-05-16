export function speakName(name: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Cancela cualquier locución en curso
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(
    `Bienvenido ${name.replace(/_/g, " ")}`
  );

  
  const voices = window.speechSynthesis.getVoices();
   const sabina = voices.find(
    (v) => v.name.toLowerCase().includes("sabina") && v.lang === "es-MX"
  );

  if (sabina) {
    utter.voice = sabina;
  } else {
    // fallback en caso de que Sabina no esté disponible
    const fallback =
      voices.find((v) => v.lang === "es-MX") ||
      voices.find((v) => v.lang.startsWith("es"));
    if (fallback) utter.voice = fallback;
  }

  utter.rate = 1.0; // velocidad (0.1 – 10)
  utter.pitch = 1.0; // tono (0 – 2)
  window.speechSynthesis.speak(utter);
}

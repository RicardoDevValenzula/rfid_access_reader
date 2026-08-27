// reader-agent/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { NFC } = require("nfc-pcsc");

const KIOSK_ID = process.env.KIOSK_ID || "kiosk-1";
const API_URL = process.env.API_URL || "http://localhost:3000/access/card-read";
const STATUS_PORT = process.env.READER_AGENT_PORT || 3040;

/* -------------- Status server ----------------------------------
 * El reader no expone nada más: solo hace POST cuando pasa una
 * tarjeta. Este endpoint deja que el kiosko (mismo equipo) sepa si
 * el lector físico está conectado. */
let readerConnected = false;
let readerName = null;

const statusApp = express();
statusApp.use(cors());
statusApp.get("/status", (_req, res) => {
  res.json({ connected: readerConnected, readerName });
});
statusApp.listen(STATUS_PORT, () =>
  console.log(`📡  Reader-status listo  ➜  http://localhost:${STATUS_PORT}/status`)
);

const nfc = new NFC();

nfc.on("reader", (reader) => {
  console.log(`📶  Lector detectado: ${reader.name}`);
  readerConnected = true;
  readerName = reader.name;

  let currentUid = null; // UID que está actualmente en el campo
  let lastSentAt = 0; // timestamp para anti‑rebote

  reader.on("card", async (card) => {
    const uid = card.uid;

    // Anti‑rebote: ignora si pasó <1 s desde la última lectura enviada
    const now = Date.now();
    if (now - lastSentAt < 3000) return;

    currentUid = uid;
    lastSentAt = now;

    console.log(`▶️  UID leído: ${uid}`);

    try {
      const res = await axios.post(API_URL, { uid, kioskId: KIOSK_ID });
      if (res.data.ok) {
        console.log(`✅  Registro OK para ${res.data.employee.name}`);
      } else {
        console.warn(`⚠️  Tarjeta no registrada (${uid})`);
      }
    } catch (err) {
      console.error("❌  Error al enviar:", err.message);
    }
  });

  reader.on("card-off", () => {
    // Tarjeta retirada del campo
    currentUid = null;
    console.log("⏏️  Tarjeta fuera de rango");
  });

  reader.on("error", (err) => console.error("Reader error", err));
  reader.on("end", () => {
    console.log("Reader disconnected");
    readerConnected = false;
    readerName = null;
  });
});

nfc.on("error", (err) => console.error("NFC error", err));

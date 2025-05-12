/* ---------------------------------------------------------------
 *  writer-agent  |  ACR122U  |  Enrolar tarjetas NTAG213
 * --------------------------------------------------------------- */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { NFC } = require("nfc-pcsc");
const ndef = require("ndef");

/* -------------- Config ---------------------------------------- */
const PORT = process.env.AGENT_PORT || 3030;
const API_URL = process.env.API_URL || "http://192.168.1.141:3000";
const ADMIN_KEY = process.env.ADMIN_KEY || ""; // si /access/link-card exige guard
const ENABLE_UL_WRITE = !!process.env.ENABLE_UL_WRITE; // activa comando especial
/* -------------------------------------------------------------- */

const app = express();
app.use(
  cors({
    origin: "http://192.168.1.141:3001",
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

let pending = null; // { employeeNumber, resolve }
let lastState = "idle";

/* ----------- POST /enroll  ------------------------------------ */
app.post("/enroll", (req, res) => {
  const { employeeNumber } = req.body;
  if (!employeeNumber) return res.status(400).send("employeeNumber required");
  if (pending) return res.status(409).send("already waiting a tag");

  pending = { employeeNumber, resolve: () => res.send("OK") };
  console.log(`📝  Esperando tag para #${employeeNumber}`);
});
app.get("/enroll/status", (_req, res) => res.json({ state: lastState }));

app.listen(PORT, () =>
  console.log(`✏️  Writer-API listo  ➜  http://localhost:${PORT}/enroll`)
);

/* -------------- NFC ------------------------------------------- */
const nfc = new NFC();

nfc.on("reader", (reader) => {
  if (!reader.name.includes("ACR122")) {
    console.log("🚫  Ignoro lector", reader.name);
    return;
  }
  console.log(`✏️  Lector escritor (${reader.name}) conectado`);

  (async () => {
    if (ENABLE_UL_WRITE) {
      /* Para firmwares que requieren activar modo Ultralight */
      const cmd = Buffer.from("FF00000004D4001201", "hex");
      const resp = await reader.transmit(cmd, 40);
      console.log("Set PICC Operating Parameter resp:", resp.toString("hex"));
    }
  })();

  reader.on("card", async (card) => {
    if (!pending) return;

    const { employeeNumber, resolve } = pending;
    lastState = "pending";
    try {
      // 1. Construir NDEF Text
      const ndefMsg = ndef.encodeMessage([
        ndef.textRecord(String(employeeNumber)),
      ]);

      // 2. Añadir TLV
      const tlv = Buffer.concat([
        Buffer.from([0x03, ndefMsg.length]),
        Buffer.from(ndefMsg),
        Buffer.from([0xfe]),
      ]);

      // 3. Padding a 4 bytes
      const pad = (4 - (tlv.length % 4)) % 4;
      const data = Buffer.concat([tlv, Buffer.alloc(pad)]);

      console.log(`TLV (${tlv.length}B) padded → ${data.length}B`);
      console.log("HEX:", data.toString("hex"));

      // 4. Escribir página por página
      for (let i = 0; i < data.length / 4; i++) {
        const page = 4 + i;
        const slice = data.subarray(i * 4, i * 4 + 4);
        await reader.write(page, slice);
      }

      // 5. Confirmar lectura
      const after = await reader.read(4, data.length, data.length);
      console.log("Después:", after.toString("hex"));

      console.log(`✅  Nº ${employeeNumber} grabado en UID ${card.uid}`);

      // 6. Vincular UID ↔ empleado en backend
      await axios.post(
        `${API_URL}/employees/link-card`,
        { uid: card.uid, employeeNumber: employeeNumber },
        { headers: ADMIN_KEY ? { "x-admin-key": ADMIN_KEY } : {} }
      );
      lastState = "success";
      resolve();
    } catch (err) {
      console.error("❌  Error al grabar:", err.message);
      lastState = "error";
    } finally {
      pending = null;
      setTimeout(() => {
        lastState = "idle";
      }, 3000);
    }
  });

  reader.on("error", (err) => console.error("Reader error", err));
  reader.on("end", () => console.log("Reader disconnected"));
});

nfc.on("error", (err) => console.error("NFC error", err));

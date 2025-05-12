/* -----------------------------------------------------------------
 * read-ndef.js  –  Comprueba qué se grabó en la NTAG213
 * Requisitos:  nfc-pcsc   ndef
 * ----------------------------------------------------------------- */
const { NFC } = require("nfc-pcsc");
const ndef = require("ndef");

const nfc = new NFC();

nfc.on("reader", (reader) => {
  if (!reader.name.includes("ACR122")) {
    console.log("Ignoro lector", reader.name);
    return;
  }
  console.log(`🔍  Lector ${reader.name} listo. Acerque la tarjeta…`);

  reader.on("card", async (card) => {
    try {
      /* Leer 48 bytes a partir de página 4 (suficiente para NDEF corto) */
      const data = await reader.read(4, 48, 16);
      console.log("HEX dump:", data.toString("hex"));

      /* Buscar TLV 0x03 que indica comienzo de mensaje NDEF */
      const tlvIdx = data.indexOf(0x03);
      if (tlvIdx === -1) {
        console.log("No se encontró TLV NDEF (0x03)");
        return;
      }

      const len = data[tlvIdx + 1];
      const ndefBytes = data.subarray(tlvIdx + 2, tlvIdx + 2 + len);
      const records = ndef.decodeMessage(ndefBytes);

      if (records.length === 0) {
        console.log("Mensaje NDEF vacío");
        return;
      }

      const first = records[0];
      if (first.type === "T") {
        const text = ndef.text.decodePayload(first.payload);
        console.log("📖  Registro Text leido:", text);
      } else {
        console.log("Primer registro no es de tipo Text. Tipo:", first.type);
      }
    } catch (err) {
      console.error("Error leyendo NDEF:", err);
    }
  });

  reader.on("error", (err) => console.error("Reader error", err));
  reader.on("end", () => console.log("Reader disconnected"));
});

nfc.on("error", (err) => console.error("NFC error", err));

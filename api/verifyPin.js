export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { codigo, pin } = req.body;
  if (!codigo || !pin) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  const correctPin = globalThis.verificationPins?.[codigo];
  if (!correctPin) {
    return res.status(400).json({ error: "No se ha enviado PIN para este código" });
  }

  if (parseInt(pin) === correctPin) {
    // Aquí puedes debitar puntos en tu API de Loyverse
    delete globalThis.verificationPins[codigo];
    return res.status(200).json({ message: "PIN correcto, compra confirmada!" });
  } else {
    return res.status(400).json({ error: "PIN incorrecto" });
  }
}

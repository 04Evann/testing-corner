import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { codigo, email } = req.body;

  if (!codigo || !email) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  // Genera un PIN aleatorio de 6 dígitos
  const pin = Math.floor(100000 + Math.random() * 900000);

  // Guardar el PIN en memoria temporal (o base de datos si quieres)
  // Para ejemplo rápido vamos a usar un objeto global
  globalThis.verificationPins = globalThis.verificationPins || {};
  globalThis.verificationPins[codigo] = pin;

  // Configura tu API de Brevo
  const apiKey = process.env.BREVO_API_KEY; // Pones tu API Key en Vercel
  const senderEmail = "no-reply@happycorner.lol";

  const body = {
    sender: { email: senderEmail, name: "Happy Corner" },
    to: [{ email }],
    subject: "Tu PIN de verificación Happy Corner",
    htmlContent: `<p>Hola! Tu PIN de verificación es: <b>${pin}</b></p><p>Ingresa este PIN para confirmar tu compra con Happy Puntos.</p>`
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: "Error enviando el correo", details: errText });
    }

    res.status(200).json({ message: "PIN enviado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno", details: error.message });
  }
}

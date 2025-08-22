import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, email, happyCodigo, carrito, total } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Happy Corner" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verificación de tu pedido Happy",
      text: `Hola ${nombre},\n\nGracias por tu pedido. Para confirmar, tu HappyCódigo es: ${happyCodigo}\n\nResumen del pedido:\n${carrito}\nTotal: ${total}\n\nSi hay algún problema, contáctanos por WhatsApp.`,
    });

    return res.status(200).json({ message: "Correo enviado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error enviando correo" });
  }
}

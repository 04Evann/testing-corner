import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { email, codigo } = req.body;

  if (!email || !codigo) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  try {
    // Configuración del transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // ejemplo: smtp.gmail.com
      port: process.env.SMTP_PORT || 465,
      secure: true, // true para 465
      auth: {
        user: process.env.SMTP_USER, // tu correo
        pass: process.env.SMTP_PASS  // tu contraseña o app password
      }
    });

    // Contenido del correo
    const mailOptions = {
      from: `"Happy Corner" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verificación de HappyPuntos",
      html: `
        <h2>Hola 👋</h2>
        <p>Acabas de usar tu <strong>HappyCódigo: ${codigo}</strong> para hacer un pedido en Happy Corner.</p>
        <p>Si fuiste tú, todo listo ✅. Si no, ignora este correo.</p>
        <p>Gracias por comprar con nosotros 😎</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Correo de verificación enviado." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error enviando correo." });
  }
}

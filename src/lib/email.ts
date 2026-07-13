import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarCodigoVerificacion(correo: string, codigo: string) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[EMAIL DEV] Código para ${correo}: ${codigo}`);
      return;
    }

    throw new Error("La configuración de correo no está disponible");
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: correo,
    subject: "Código de verificación de tu cuenta",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verificación de correo</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="letter-spacing: 4px; font-size: 32px;">${codigo}</h1>
        <p>Este código expira en 10 minutos.</p>
      </div>
    `,
  });
}

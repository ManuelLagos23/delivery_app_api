import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarCodigoVerificacion(
  correo: string,
  codigo: string
) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Falta RESEND_API_KEY");
  }

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "manuellagos2398@gmail.com",
    subject: "Código de verificación de tu cuenta",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verificación de correo</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="letter-spacing: 4px; font-size: 32px;">
          ${codigo}
        </h1>
        <p>Este código expira en 10 minutos.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
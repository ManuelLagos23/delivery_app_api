import { prisma } from "@/lib/prisma";
import { enviarCodigoVerificacion } from "@/lib/email";

function generarCodigoVerificacion() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function validarCodigoVerificacion(correo: string, codigo: string) {
  const verificacion = await prisma.verificacionCorreo.findUnique({
    where: { correo },
  });

  if (!verificacion) {
    throw new Error("No existe un proceso de verificación para este correo");
  }

  if (verificacion.expiracion < new Date()) {
    throw new Error("El código de verificación ha expirado");
  }

  if (verificacion.codigo !== codigo) {
    const nuevosIntentos = verificacion.intentos + 1;

    await prisma.verificacionCorreo.update({
      where: { correo },
      data: { intentos: nuevosIntentos },
    });

    if (nuevosIntentos >= 3) {
      await prisma.verificacionCorreo.delete({ where: { correo } });
    }

    throw new Error("Código de verificación incorrecto");
  }

  return verificacion;
}

export async function enviarCodigoRegistro(correo: string) {
  const clienteExistente = await prisma.cliente.findUnique({
    where: { correo_cliente: correo },
  });

  if (clienteExistente) {
    throw new Error("El correo ya está registrado");
  }

  const codigo = generarCodigoVerificacion();
  const expiracion = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificacionCorreo.upsert({
    where: { correo },
    update: {
      codigo,
      expiracion,
      intentos: 0,
    },
    create: {
      correo,
      codigo,
      expiracion,
      intentos: 0,
    },
  });

  await enviarCodigoVerificacion(correo, codigo);

  return { mensaje: "Código enviado correctamente" };
}

export async function verificarCodigoRegistro(correo: string, codigo: string) {
  await validarCodigoVerificacion(correo, codigo);

  return { mensaje: "Código verificado correctamente" };
}

export async function crearClienteConVerificacion(data: {
  correo_cliente: string;
  codigo_verificacion: string;
  nombre_cliente: string;
  apellido_cliente: string;
  telefono_cliente: string;
  identidad_cliente: string;
  foto_identidad_cliente?: string;
}) {
  await validarCodigoVerificacion(data.correo_cliente, data.codigo_verificacion);

  const clienteExistente = await prisma.cliente.findUnique({
    where: { correo_cliente: data.correo_cliente },
  });

  if (clienteExistente) {
    throw new Error("El correo ya está registrado");
  }

  const cliente = await prisma.cliente.create({
    data: {
      nombre_cliente: data.nombre_cliente,
      apellido_cliente: data.apellido_cliente,
      telefono_cliente: data.telefono_cliente,
      correo_cliente: data.correo_cliente,
      identidad_cliente: data.identidad_cliente,
      foto_identidad_cliente: data.foto_identidad_cliente,
      estado_cliente: true,
    },
  });

  await prisma.verificacionCorreo.delete({ where: { correo: data.correo_cliente } });

  return cliente;
}

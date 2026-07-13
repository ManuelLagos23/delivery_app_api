import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ClienteInput } from "@/schemas/cliente.schema";

export async function crearCliente(data: ClienteInput) {
  const clienteExistente = await prisma.cliente.findUnique({
    where: {
      correo_cliente: data.correo_cliente,
    },
  });

  if (clienteExistente) {
    throw new Error("El correo ya está registrado");
  }

  const identidadExistente = await prisma.cliente.findFirst({
    where: {
      identidad_cliente: data.identidad_cliente,
    },
  });

  if (identidadExistente) {
    throw new Error("La identidad ya está registrada");
  }

  try {
    const cliente = await prisma.cliente.create({
      data: {
        ...data,
        estado_cliente: true,
      },
    });

    return cliente;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target
        : [];

      if (target.includes("correo_cliente")) {
        throw new Error("El correo ya está registrado");
      }

      if (target.includes("identidad_cliente")) {
        throw new Error("La identidad ya está registrada");
      }
    }

    throw error;
  }
}
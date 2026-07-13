import { z } from "zod";

export const clienteSchema = z.object({
  nombre_cliente: z
    .string()
    .min(2, "El nombre debe tener mínimo 2 caracteres")
    .max(50)
    .trim(),

  apellido_cliente: z
    .string()
    .min(2, "El apellido debe tener mínimo 2 caracteres")
    .max(50)
    .trim(),

  telefono_cliente: z
    .string()
    .min(8)
    .max(20)
    .trim(),

  correo_cliente: z
    .string()
    .email("Correo inválido")
    .toLowerCase()
    .trim(),

  identidad_cliente: z
    .string()
    .min(5)
    .max(30)
    .trim(),

  foto_identidad_cliente: z
    .string()
    .url()
    .optional(),

  estado_cliente: z
    .boolean()
    .default(true),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
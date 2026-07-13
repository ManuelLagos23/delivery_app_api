import { z } from "zod";
import { clienteSchema } from "@/schemas/cliente.schema";

export const enviarCodigoSchema = z.object({
  correo_cliente: z.string().email("Correo inválido").trim().toLowerCase(),
});

export const verificarClienteSchema = z.object({
  correo_cliente: z.string().email("Correo inválido").trim().toLowerCase(),
  codigo_verificacion: z
    .string()
    .regex(/^\d{6}$/, "El código de verificación debe ser de 6 dígitos"),
});

export const registrarClienteSchema = clienteSchema
  .omit({ estado_cliente: true })
  .extend({
    codigo_verificacion: z
      .string()
      .regex(/^\d{6}$/, "El código de verificación debe ser de 6 dígitos"),
  });

export type EnviarCodigoInput = z.infer<typeof enviarCodigoSchema>;
export type VerificarClienteInput = z.infer<typeof verificarClienteSchema>;
export type RegistrarClienteInput = z.infer<typeof registrarClienteSchema>;

import { enviarCodigoSchema } from "@/schemas/verificacion.schema";
import { enviarCodigoRegistro } from "@/services/verificacion.service";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = enviarCodigoSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.issues.map((error) => ({
          campo: error.path[0] ?? "general",
          mensaje: error.message,
        })),
        400
      );
    }

    const result = await enviarCodigoRegistro(validation.data.correo_cliente);

    return successResponse(result, 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "El correo ya está registrado") {
        return errorResponse(error.message, 409);
      }

      return errorResponse(error.message, 400);
    }

    return errorResponse("Error interno del servidor", 500);
  }
}

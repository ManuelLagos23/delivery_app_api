import { verificarClienteSchema } from "@/schemas/verificacion.schema";
import { verificarCodigoRegistro } from "@/services/verificacion.service";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = verificarClienteSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.issues.map((error) => ({
          campo: error.path[0] ?? "general",
          mensaje: error.message,
        })),
        400
      );
    }

    const result = await verificarCodigoRegistro(
      validation.data.correo_cliente,
      validation.data.codigo_verificacion
    );

    return successResponse(result, 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }

    return errorResponse("Error interno del servidor", 500);
  }
}

import { registrarClienteSchema } from "@/schemas/verificacion.schema";
import { crearClienteConVerificacion } from "@/services/verificacion.service";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("El cuerpo de la solicitud debe ser un JSON válido", 400);
    }

    const validation = registrarClienteSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.issues.map((error) => ({
          campo: error.path[0] ?? "general",
          mensaje: error.message,
        })),
        400
      );
    }

    const cliente = await crearClienteConVerificacion(validation.data);

    return successResponse(
      {
        id: cliente.id,
        nombre: cliente.nombre_cliente,
        correo: cliente.correo_cliente,
      },
      201
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "El correo ya está registrado") {
        return errorResponse(error.message, 409);
      }

      if (error.message === "La identidad ya está registrada") {
        return errorResponse(error.message, 409);
      }

      return errorResponse(error.message || "Error interno del servidor", 500);
    }

    return errorResponse("Error interno del servidor", 500);
  }
}
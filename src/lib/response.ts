export function successResponse<T>(data: T, status: number = 200) {
  return Response.json(
    {
      success: true,
      data,
    },
    {
      status,
    }
  );
}

export function errorResponse(message: unknown, status: number) {
  return Response.json(
    {
      success: false,
      message,
    },
    {
      status,
    }
  );
}
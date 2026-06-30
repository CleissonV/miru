export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static badRequest(message: string) {
    return new ApiError(400, message)
  }

  static unauthorized(message = 'Não autorizado') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'Acesso negado') {
    return new ApiError(403, message)
  }

  static notFound(message = 'Recurso não encontrado') {
    return new ApiError(404, message)
  }

  static conflict(message: string) {
    return new ApiError(409, message)
  }
}

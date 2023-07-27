export class ObjectMapperValidationError extends Error {
  constructor(message: unknown) {
    super(JSON.stringify(message, null, 2));
    this.name = 'ObjectMapperValidationError';
  }
}

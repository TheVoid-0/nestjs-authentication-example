import { plainToInstance } from 'class-transformer';
import { ValidationError, validateOrReject, validateSync } from 'class-validator';
import { ObjectMapperValidationError } from './error/object-mapper-validation.error';

export class ObjectMapper {
  static async toInstance<T extends object>(type: new () => T, data: any): Promise<T> {
    const instance = plainToInstance(type, data);

    try {
      await validateOrReject(instance as Record<string, unknown>, { whitelist: true });
    } catch (error) {
      if (Array.isArray(error) && error[0] instanceof ValidationError) {
        this.throwValidationError(error, ObjectMapperValidationError);
      }

      throw error;
    }

    return instance;
  }

  static toInstanceSync<T extends object>(type: new () => T, data: any): T {
    const instance = plainToInstance(type, data);

    const errors = validateSync(instance as Record<string, unknown>, { whitelist: true });
    if (errors.length > 0) {
      this.throwValidationError(errors, ObjectMapperValidationError);
    }

    return instance;
  }

  private static formatValidationError(error: ValidationError) {
    const validationError: { [key: string]: any } = {};
    if (error.children && error.children.length > 0) {
      validationError[error.property] = [];
      error.children.forEach(child => {
        validationError[error.property].push(this.formatValidationError(child));
      });
      return validationError;
    }
    if (error.constraints) {
      validationError[error.property] = Object.keys(error.constraints).map(key => (error.constraints as any)[key]);
    }
    return validationError;
  }

  private static throwValidationError<T extends new (...args: any) => Error>(error: ValidationError[], errorClass: T) {
    const validationErrors = [];
    for (const e of error) {
      validationErrors.push(this.formatValidationError(e));
    }
    const errorInstance = new errorClass(validationErrors);

    throw errorInstance;
  }
}

import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsString } from 'class-validator';
import { TransformBoolean } from './@core/decorators/transformers/transform-boolean.decorator';

export class Environment {
  @IsString()
  API_URL: string;

  @Type(() => Number)
  @IsNumber()
  PORT = 3000;

  @IsIn(['development', 'production', 'test'])
  MODE: 'development' | 'production' | 'test';

  @IsIn(['debug', 'verbose', 'log', 'warn', 'error'])
  LOG_LEVEL: 'debug' | 'verbose' | 'log' | 'warn' | 'error' = 'log';

  @IsString()
  DB_HOST: string;

  @Type(() => Number)
  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  JWT_SECRET: string;

  @TransformBoolean()
  @IsBoolean()
  JWT_IS_EXPIRATION_IGNORED = true;

  @IsString()
  SMTP_DOMAIN_NAME: string;

  @IsString()
  SMTP_HOST: string;

  @Type(() => Number)
  @IsNumber()
  SMTP_PORT: number;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_PASSWORD: string;

  isProduction(): boolean {
    return this.MODE === 'production';
  }
}

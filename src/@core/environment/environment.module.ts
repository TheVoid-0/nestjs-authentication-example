import { Global, Module } from '@nestjs/common';
import { Environment } from '../../environment';
import { ClassConstructor } from 'class-transformer';
import { ObjectMapper } from '../object-mapper/object-mapper';
import { ConfigModule } from '@nestjs/config';

async function validateEnvironment<T extends object>(validationClass: ClassConstructor<T>) {
  try {
    return await ObjectMapper.toInstance(validationClass, process.env);
  } catch (error: any) {
    throw new Error(`Environment variables missing: ${error.toString()}`);
  }
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [
    {
      provide: Environment,
      useFactory() {
        return validateEnvironment(Environment);
      },
    },
  ],
  exports: [Environment],
})
export class EnvironmentModule {}

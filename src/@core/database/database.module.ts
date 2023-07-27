import { join } from 'path';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { Environment } from '../../environment';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(environment: Environment) {
        return {
          type: 'postgres',
          host: environment.DB_HOST,
          port: environment.DB_PORT,
          username: environment.DB_USER,
          password: environment.DB_PASSWORD,
          database: environment.DB_NAME,
          entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
        };
      },
      inject: [Environment],
    }),
  ],
  providers: [{ provide: DatabaseService, useExisting: getDataSourceToken() }],
  exports: [DatabaseService],
})
export class DatabaseModule {}

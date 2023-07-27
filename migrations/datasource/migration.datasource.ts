import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Environment } from '../../src/environment';
import { ObjectMapper } from '../../src/@core/object-mapper/object-mapper';

dotenv.config();

const environment: Environment = ObjectMapper.toInstanceSync(Environment, process.env);

const config: DataSourceOptions = {
  type: 'postgres',
  host: environment.DB_HOST,
  username: environment.DB_USER,
  password: environment.DB_PASSWORD,
  port: environment.DB_PORT,
  database: environment.DB_NAME,
  migrations: ['dist/migrations/*.js'],
};

export default new DataSource(config);

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: parseInt(configService.get('POSTGRES_PORT'), 10),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [path.resolve(`${__dirname}/../**/**.entity{.ts,.js}`)],
  migrations: [path.resolve(`${__dirname}/../migrations/*{.ts,.js}`)],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});

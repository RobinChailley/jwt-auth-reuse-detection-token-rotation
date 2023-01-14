import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      database: process.env.TYPEORM_DATABASE,
      entities: [process.env.TYPEORM_ENTITIES],
      host: process.env.TYPEORM_HOST,
      password: process.env.TYPEORM_PASSWORD,
      port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
      synchronize: true,
      type: 'postgres',
      username: process.env.TYPEORM_USERNAME,
    };
  }
}

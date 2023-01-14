import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from '@shared/config/typeorm';
import { UsersModule } from '@users/users.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}

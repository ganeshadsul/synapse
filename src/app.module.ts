import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './app/modules/database/database.module';
import { SeederConfigModule } from './app/modules/seeder-config/seeder-config.module';
import Joi from 'joi';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './app/common/filters/all-exceptions.filter';
import { TransformInterceptor } from './app/common/interceptors/transform.interceptor';
import { UserModule } from './app/modules/user/user.module';
import { SystemModule } from './app/modules/system/system.module';
import { AuthModule } from './app/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'qa', 'staging', 'production')
          .default('development'),
      }),
    }),
    DatabaseModule,
    SeederConfigModule,
    SystemModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

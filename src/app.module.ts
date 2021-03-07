import { Module, NestModule, MiddlewareConsumer  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {LoggerMiddleware} from './middlewares/logger.middleware';
import { AuthController } from './auth/auth.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { AuthGuard } from './shared/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { AreasModule } from './areas/areas.module';

import * as cors from 'cors'
import * as helmet from 'helmet'
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-demo', { useNewUrlParser: true }), 
    ProductsModule, 
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    AreasModule
    ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    }
  ],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors(), helmet(), LoggerMiddleware)
      .forRoutes(AuthController);
  }
}

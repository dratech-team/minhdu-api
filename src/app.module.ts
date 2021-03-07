import { Module, NestModule, MiddlewareConsumer  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/areas.module';
import { CoresModule } from './core/cores.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-demo', { useNewUrlParser: true }), 
    CoresModule,
    ProductsModule, 
    UsersModule,
    AuthModule,
    AreasModule,
    ],
  controllers: [AppController],
  providers: [AppService,],
})

export class AppModule {}

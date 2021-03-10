import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductsModule } from "./products/products.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { AreasModule } from "./areas/areas.module";
import { CoresModule } from "./core/cores.module";
import { ConfigModule } from "@nestjs/config";

const {
  DB_DRIVER,
  NODE_ENV,
  DB_HOST_LOCAL,
  DB_HOST,
  DB_PORT,
  DB_NAME
} = process.env;
const dbDriver = DB_DRIVER || "mongodb";
const dbPort = DB_PORT || 27017;
const dbHost = NODE_ENV !== "production" ? DB_HOST_LOCAL : DB_HOST;
const dbName = DB_NAME || "minhdu";
@Module({
  imports: [
    MongooseModule.forRoot(`${dbDriver}://${dbHost}:${dbPort}/${dbName}`, {
      useNewUrlParser: true
    }),
    CoresModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    AreasModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { CoresModule } from "./core/cores.module";
import { ConfigModule } from "@nestjs/config";
import { VendorsModule } from "./modules/vendors/vendors.module";
import { MaterialsWarehouseModule } from "./modules/materials-warehouse/materials-warehouse.module";
import { StorageModule } from "./modules/storage/storage.module";
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
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }),
    CoresModule,
    UsersModule,
    // AuthModule, public all api for development
    VendorsModule,
    MaterialsWarehouseModule,
    StorageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

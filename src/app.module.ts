import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";

const {
  DB_DRIVER,
  NODE_ENV,
  DB_HOST_LOCAL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;
const dbDriver = DB_DRIVER || "mongodb";
const dbPort = DB_PORT || 27017;
const dbHost = NODE_ENV !== "production" ? DB_HOST_LOCAL : DB_HOST;
const dbName = DB_NAME || "minhdu";

const url =
  NODE_ENV !== "production"
    ? `${dbDriver}://${dbHost}:${dbPort}/${dbName}`
    : DB_HOST;

@Module({
  imports: [
    MongooseModule.forRoot(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    // AuthModule, public all api for development
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

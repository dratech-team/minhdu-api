import { Module } from "@nestjs/common";
import { ImportExportService } from "./import-export.service";
import { ImportExportController } from "./import-export.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [ImportExportController],
  providers: [ImportExportService, PrismaService],
})
export class ImportExportModule {}

import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [SocialController],
  providers: [PrismaService, SocialService]
})
export class SocialModule {}

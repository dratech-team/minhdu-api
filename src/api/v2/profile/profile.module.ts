import {Module} from '@nestjs/common';
import {ProfileService} from './profile.service';
import {ProfileController} from './profile.controller';
import {PrismaService} from "../../../prisma.service";
import {ProfileRepository} from "./profile.repository";

@Module({
  controllers: [ProfileController],
  providers: [PrismaService, ProfileService, ProfileRepository]
})
export class ProfileModule {
}

import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateSocialDto} from './dto/create-social.dto';
import {UpdateSocialDto} from './dto/update-social.dto';
import {PrismaService} from "../../../prisma.service";


@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSocialDto) {
    try {
      return await this.prisma.social.create({ data: body });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    return `This action returns all social`;
  }

  findOne(id: number) {
    return `This action returns a #${id} social`;
  }

  update(id: number, updateSocialDto: UpdateSocialDto) {
    return `This action updates a #${id} social`;
  }

  remove(id: number) {
    return `This action removes a #${id} social`;
  }
}

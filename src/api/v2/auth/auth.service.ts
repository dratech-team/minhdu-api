import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {SignupCredentialDto} from './dto/signup-credential.dto';
import {SignInCredentialDto} from "./dto/signin-credential.dto";
import {PrismaService} from "../../../prisma.service";
import {generateHash} from "../../../core/methods/validators.method";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
  }

  async register(body: SignupCredentialDto): Promise<{ status: string }> {
    try {
      body.password = await generateHash(body.password);
      await this.prisma.account.create({data: body});
      return {status: 'Register Success!'};
    } catch (e) {
      console.error(e);
      if (e.code === 'P2002') {
        throw new ConflictException(`Username ${body.username} đã tồn tại.`);
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async signIn(ipaddress: any, body: SignInCredentialDto): Promise<any> {
    try {
      const user = await this.prisma.account.findUnique({
        where: {username: body.username},
        include: {branch: true},
      });
      if (!user) {
        throw new NotFoundException('username không tồn tại');
      }
      const isValid = await bcrypt.compare(body.password, user.password);

      if (!isValid) {
        throw new UnauthorizedException();
      }

      const token = this.jwtService.sign(user);
      // save logged at
      this.prisma.account.update({
        where: {id: user.id},
        data: {
          loggedAt: new Date(),
          ip: ipaddress
        }
      }).then();

      return Object.assign(user, {token});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(profile: ProfileEntity) {
    const accounts = await this.prisma.account.findMany({
      where: {username: {notIn: profile.username}},
      select: {
        id: true,
        username: true,
        branch: true,
        role: true,
        loggedAt: true,
        ip: true,
        timestamp: true,
      }
    });
    return accounts.map(account => Object.assign(account, {createdAt: account.timestamp}));
  }
}

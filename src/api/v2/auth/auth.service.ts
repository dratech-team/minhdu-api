import {BadRequestException, ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {SignupCredentialDto} from './dto/signup-credential.dto';
import {SignInCredentialDto} from "./dto/signin-credential.dto";
import {PrismaService} from "../../../prisma.service";
import {generateHash} from "../../../core/methods/validators.method";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
  }

  async register(body: SignupCredentialDto): Promise<{ status: string }> {
    try {
      await this.prisma.account.create({
        data: {
          username: body.username,
          password: await generateHash(body.password),
          role: body.role,
          employee: body.employeeId ? {connect: {id: body.employeeId}} : {}
        }
      });
      return {status: 'Register Success!'};
    } catch (e) {
      console.log(e);
      if (e.code === 'P2002') {
        throw new ConflictException(`Username ${body.username} đã tồn tại.`);
      } else {
        throw new BadRequestException(e);
      }

    }
  }

  async signIn(body: SignInCredentialDto): Promise<any> {
    try {
      const user = await this.prisma.account.findUnique({
        where: {username: body.username}
      });
      const isValid = await bcrypt.compare(body.password, user.password);

      if (!isValid) {
        throw new UnauthorizedException();
      }

      const payload = {
        accountId: user.id,
        username: user.username,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);

      return {
        id: user.id,
        role: user.role,
        token,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}

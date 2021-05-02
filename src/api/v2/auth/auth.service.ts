import {BadRequestException, HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
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
          employee: {connect: {id: body.employeeId}}
        }
      });
      return {status: 'Register Success!'};
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async signIn(body: SignInCredentialDto): Promise<{ token: string }> {
    try {
      const user = await this.prisma.account.findUnique({where: {username: body.username}});
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
      return {token};
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}

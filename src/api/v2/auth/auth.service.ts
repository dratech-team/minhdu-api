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
      body.password = await generateHash(body.password);
      await this.prisma.account.create({
        data: {
          username: body.username,
          role: body.role,
          branch: body.branchId ? {connect: {id: body.branchId}} : {},
          password: body.password,
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
    let payload: any;
    try {
      const user = await this.prisma.account.findUnique({
        where: {username: body.username},
        include: {branch: true}
      });
      const isValid = await bcrypt.compare(body.password, user.password);

      if (!isValid) {
        throw new UnauthorizedException();
      }

      if (user.branch) {
        payload = {
          accountId: user.id,
          username: user.username,
          role: user.role,
          branchId: user.branch.id,
        };
      } else {
        payload = {
          accountId: user.id,
          username: user.username,
          role: user.role,
        };
      }

      const token = this.jwtService.sign(payload);

      return user.branch ? {
        id: user.id,
        role: user.role,
        branchId: user.branch.id,
        token,
      } : {
        id: user.id,
        role: user.role,
        token,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}

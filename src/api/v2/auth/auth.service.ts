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
          employee: body.employeeId ? {connect: {id: body.employeeId}} : {},
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
        include: {employee: {select: {position: {select: {department: {select: {branchId: true}}}}}}}
      });
      const branchId = user?.employee?.position?.department?.branchId;
      if (!user) {
        throw new NotFoundException('username không tồn tại');
      }
      const isValid = await bcrypt.compare(body.password, user.password);

      if (!isValid) {
        throw new UnauthorizedException();
      }

      if (user.employee) {
        payload = {
          accountId: user.id,
          username: user.username,
          role: user.role,
          branchId: branchId
        };
      } else {
        payload = {
          accountId: user.id,
          username: user.username,
          role: user.role,
        };
      }

      const token = this.jwtService.sign(payload);

      return user.employee ? {
        id: user.id,
        role: user.role,
        branchId: branchId,
        token,
      } : {
        id: user.id,
        role: user.role,
        token,
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}

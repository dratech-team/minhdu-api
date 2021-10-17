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
import {UpdateAuthDto} from "./dto/update-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
  }

  async register(profile: ProfileEntity, body: SignupCredentialDto): Promise<{ status: string }> {
    try {
      body.password = await generateHash(body.password);
      await this.prisma.account.create({
        data: {
          username: body.username,
          password: body.password,
          roleId: body.roleId,
          branches: {connect: body.branchIds?.map(id => ({id}))},
          appName: body.appName,
          managedBy: profile?.role,
        }
      });
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
        include: {branches: true, role: true},
      });
      if (!user) {
        throw new NotFoundException('username không tồn tại');
      }
      const isValid = await bcrypt.compare(body.password, user.password);

      if (!isValid) {
        throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không hợp lệ. Vui lòng kiểm tra lại");
      }

      const token = this.jwtService.sign(Object.assign(user, {role: user?.role?.role}));
      // save logged at
      this.prisma.account.update({
        where: {id: user.id},
        data: {
          loggedAt: new Date(),
          ip: ipaddress
        }
      }).then();
      return Object.assign(user, {token: token});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async changePassword(id: number, password: string) {
    try {
      await this.prisma.account.update({
        where: {id},
        data: {
          password: await generateHash(password)
        }
      });
      return {
        status: 201,
        message: "Mật khẩu đã được thay đổi thành công!!!"
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, body: UpdateAuthDto) {
    try {
      return await this.prisma.account.update({
        where: {id},
        data: {
          roleId: body.roleId,
          branches: {set: body.branchIds?.map(id => ({id}))}
        },
        include: {
          branches: true,
          _count: true,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(profile: ProfileEntity) {
    const accounts = await this.prisma.account.findMany({
      where: {
        username: {notIn: profile.username},
        managedBy: profile.role,
      },
      select: {
        id: true,
        username: true,
        branches: true,
        role: true,
        loggedAt: true,
        ip: true,
        timestamp: true,
      }
    });
    return accounts.map(account => Object.assign(account, {createdAt: account.timestamp}));
  }

  async remove(profile: ProfileEntity, id: number) {
    return await this.prisma.account.delete({where: {id}});
  }
}

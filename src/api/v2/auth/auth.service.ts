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
import {SearchAuthDto} from "./dto/search-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
  }

  async register(profile: ProfileEntity, body: SignupCredentialDto) {
    try {
      body.password = await generateHash(body.password);
      return await this.prisma.account.create({
        data: {
          username: body.username,
          password: body.password,
          role: {connect: {id: body.roleId}},
          appName: body.appName,
          managedBy: profile?.role,
          branches: body.branchIds?.length ? {connect: body.branchIds?.map(id => ({id}))} : {},
        },
        include: {
          branches: true,
          role: true,
        }
      });
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
          ip: ipaddress,
          // token: 'Bearer ' + token,
        }
      }).then(v => console.log("login success ", v));
      return Object.assign(user, {token: token});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async changePassword(profile: ProfileEntity, password: string) {
    try {
      const account = await this.prisma.account.findUnique({where: {id: profile.id}});

      await this.prisma.account.update({
        where: {id: account.id},
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
          role: {connect: {id: body.roleId}},
          branches: body.branchIds?.length ? {set: body.branchIds?.map(id => ({id}))} : {},
        },
        include: {
          branches: true,
          _count: true,
          role: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(profile: ProfileEntity, search: SearchAuthDto) {
    const [total, data] = await Promise.all([
      this.prisma.account.count({
        where: {
          id: {notIn: profile.id},
          managedBy: profile.role,
          branches: search?.branchIds?.length ? {some: {id: {in: search.branchIds}}} : {}
        }
      }),
      this.prisma.account.findMany({
        take: search?.take,
        skip: search?.skip,
        where: {
          id: {notIn: profile.id},
          managedBy: profile.role,
          branches: search?.branchIds?.length ? {some: {id: {in: search.branchIds}}} : {}
        },
        include: {
          branches: true,
          role: true,
        }
      })
    ]);
    return {total, data};
  }

  async remove(profile: ProfileEntity, id: number) {
    return await this.prisma.account.delete({where: {id}});
  }
}

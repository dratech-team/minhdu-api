import {HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {BaseService} from "../../../core/crud-base/base.service";
import {CredentialDocument, CredentialEntity} from "./entities/credential.entity";
import {Model, PaginateModel} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {SignupCredentialDto} from "./dto/signup-credential.dto";
import {generateHash} from "../../../core/methods/validators.method";
import {SignInCredentialDto} from "./dto/signin-credential.dto";
import {ObjectId} from "mongodb";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import {JwtPayload} from "./interface/jwt-payload.interface";

@Injectable()
export class AuthService extends BaseService<CredentialDocument> {
  constructor(
    @InjectModel(ModelName.ACCOUNT)
    private readonly authModel: PaginateModel<CredentialDocument>,
    private readonly jwtService: JwtService,
  ) {
    super(authModel);
  }

  async create(body: SignupCredentialDto, ...args): Promise<any> {
    body = await this.changeRequest(body);
    return super.create(body, ...args);
  }

  async signIn(body: SignInCredentialDto): Promise<{ token: string }> {
    try {
      const user = await this.findByAccount(body.username);
      const isValid = await bcrypt.compare(body.password, user.password);

      if (!isValid) {
        throw new UnauthorizedException();
      }

      const payload: JwtPayload = {
        accountId: user._id,
        username: user.username,
        role: user.role,
        userId: user.userId
      };

      const token = this.jwtService.sign(payload);
      return {token};
    } catch (e) {
      throw new HttpException(e, e.status);
    }
  }

  async findByAccount(username: string): Promise<CredentialEntity> {
    return this.authModel.findOne({username: username});
  }

  async changeRequest(body: SignupCredentialDto): Promise<SignupCredentialDto> {
    body.password = await generateHash(body.password);
    body.userId = new ObjectId(body.userId);
    return body;
  }
}

import {Injectable} from '@nestjs/common';
import {BaseService} from "../../../core/crud-base/base.service";
import {CredentialDocument} from "./entities/credential.entity";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {SignupCredentialDto} from "./dto/signup-credential.dto";
import {generateHash, validPassword} from "../../../core/methods/validators.method";
import {SignInCredentialDto} from "./dto/signin-credential.dto";
import {ObjectId} from "mongodb";
import {JwtPayload} from "./interface/jwt-payload.interface";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService extends BaseService<CredentialDocument> {
  constructor(
    @InjectModel(ModelName.ACCOUNT)
    private readonly authModel: Model<CredentialDocument>,
    private readonly userService: UserService,
  ) {
    super(authModel);
  }

  async create(body: SignupCredentialDto, ...args): Promise<any> {
    body = await this.changeRequest(body);
    return super.create(body, ...args);
  }

  async signIn(body: SignInCredentialDto): Promise<JwtPayload> {
    const isValid = validPassword(body.password);

  }

  async changeRequest(body: SignupCredentialDto): Promise<SignupCredentialDto> {
    body.password = await generateHash(body.password);
    body.userId = new ObjectId(body.userId);
    return body;
  }
}

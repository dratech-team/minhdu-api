import {Controller, Post} from '@nestjs/common';
import {BaseController} from "../../../core/crud-base/base-controller";
import {CredentialEntity} from "./entities/credential.entity";
import {AuthService} from "./auth.service";
import {SignupCredentialDto} from "./dto/signup-credential.dto";

@Controller('v1/auth')
export class AuthController extends BaseController<CredentialEntity> {
  constructor(
    private readonly service: AuthService
  ) {
    super(service);
  }

  @Post('/signup')
  async create(body: SignupCredentialDto, ...args): Promise<CredentialEntity> {
    return super.create(body, ...args);
  }
}

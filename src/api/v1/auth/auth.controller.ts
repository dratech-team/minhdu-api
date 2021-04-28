import {Body, Controller, Post} from '@nestjs/common';
import {CredentialEntity} from "./entities/credential.entity";
import {AuthService} from "./auth.service";
import {SignupCredentialDto} from "./dto/signup-credential.dto";
import {SignInCredentialDto} from "./dto/signin-credential.dto";

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly service: AuthService
  ) {
  }

  @Post('/signup')
  async register(@Body() body: SignupCredentialDto): Promise<CredentialEntity> {
    return this.service.register(body);
  }

  @Post('/signin')
  async signIn(@Body() body: SignInCredentialDto): Promise<{ token: string }> {
    return this.service.signIn(body);
  }
}

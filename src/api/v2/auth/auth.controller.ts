import {Body, Controller, Post, Req} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupCredentialDto} from './dto/signup-credential.dto';
import {SignInCredentialDto} from "./dto/signin-credential.dto";

const requestIp = require('request-ip');

@Controller('v2/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {
  }

  @Post('/signup')
  async register(@Body() body: SignupCredentialDto): Promise<{ status: string }> {
    return await this.service.register(body);
  }

  @Post('/signin')
  async signIn(
    @Req() req: any,
    @Body() body: SignInCredentialDto
  ): Promise<{ token: string }> {
    return this.service.signIn(requestIp.getClientIp(req), body);
  }
}

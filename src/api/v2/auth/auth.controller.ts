import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupCredentialDto} from './dto/signup-credential.dto';
import {SignInCredentialDto} from "./dto/signin-credential.dto";
import {IpAddress} from "../../../core/decorators/ip-request.decorator";

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
    @IpAddress() ipaddress: string,
    @Body() body: SignInCredentialDto
  ): Promise<{ token: string }> {
    return this.service.signIn(ipaddress, body);
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto'
import {Public} from '../shared/metadata'
import { SetMetadata } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @SetMetadata('isPublic', true)
  async login(@Body() loginUserDto: LoginUserDto){
      return await this.authService.validateUserByPassword(loginUserDto);
  }
}

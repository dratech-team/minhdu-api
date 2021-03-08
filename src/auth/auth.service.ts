import { HttpException, Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService){}

    async validateUserByPassword(loginAttempt: LoginUserDto) {
        console.log('loginAttempt.email', loginAttempt.email);
        
        // This will be used for the initial login
        let userToAttempt = await this.usersService.findOne(loginAttempt.email);
        console.log('userToAttempt', userToAttempt);

        if(!userToAttempt) {
            throw new HttpException('Email Or Password Invalid', HttpStatus.BAD_REQUEST);
        }
        
        const isValidPassword = await userToAttempt.comparePassword(loginAttempt.password);
        console.log('isValidPassword', isValidPassword);
        
        if(!isValidPassword) {
            throw new UnauthorizedException();
        }

        return this.createJwtPayload(userToAttempt)
    }

    async validateUserByJwt(payload: JwtPayload) { 

        // This will be used when the user has already logged in and has a JWT
        let user = await this.usersService.findOne(payload.email);

        if(user){
            return this.createJwtPayload(user);
        } else {
            throw new UnauthorizedException();
        }

    }

    createJwtPayload(user){
        console.log('process JWT_USER_EXPIRE', process.env.JWT_USER_EXPIRE);
        
        let data: JwtPayload = {
            email: user.email
        };

        let jwt = this.jwtService.sign(data);

        return {
            expiresIn: process.env.JWT_USER_EXPIRE || '7h',
            token: jwt
        }

    }

}

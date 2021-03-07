import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';

import {Reflector} from '@nestjs/core';
import {IS_PUBLIC_KEY} from '../shared/metadata';
import * as jwt from 'jsonwebtoken';

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      console.log(1);
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      console.log('isPublic', isPublic);
      if(isPublic)  return true;

      if (request) {
        if (!request.headers.authorization) {
          return false;
        }
        console.log(3);
        request.user = await this.validateToken(request.headers.authorization);
        return true;
      }
    }

    async validateToken(auth: string) {
      if (auth.split(' ')[0] !== 'Bearer') {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const token = auth.split(' ')[1];
      console.log('token', token);
      try {
          console.log('process.env.SECRET', process.env.SECRET);
          
        const decoded: any = await jwt.verify(token, process.env.SECRET);
        console.log('decoded', decoded);
        
        return decoded;
      } catch (err) {
        const message = 'Token error: ' + (err.message || err.name);
        throw new HttpException(message, HttpStatus.UNAUTHORIZED);
      }
    }
  }

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies';
import {JWT_SECRET} from  '../config/constan'

@Module({
  imports:[
    PassportModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        secret:config.get<string>(JWT_SECRET),
        signOptions:{expiresIn:'60s'}
      })

   
    }),
    UserModule
  ],
  providers: [AuthService,LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}

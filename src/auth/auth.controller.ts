import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/common/decarators';
import { User as UserEntity } from 'src/user/entity';
import { JwtAuthGuard, LocalAuthGuard } from './guards';



@Controller('auth')
export class AuthController {

    @UseGuards(LocalAuthGuard,  JwtAuthGuard)
    @Post('login')
    login(
        @User() user:UserEntity
    ){
        return user 
    }

    @Get('profile')
    profile(){
        return 'estos son tus datos'
    }
}

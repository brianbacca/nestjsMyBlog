import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


import { Auth, User } from 'src/common/decarators';
import { User as UserEntity } from 'src/user/entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from './guards';


@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService : AuthService
    ){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
   async  login(
        @User() user:UserEntity
    ){
        const data = await this.authService.login(user)
        return {
            msg:"Login exitoso",data
         }
    }

    @Auth()
    @Get('profile')
    profile(
        @User() user:UserEntity
    ){
        return{
            msg:'correct request',
            user
        }
    }

    @Auth()
    @Get('refresh')
     refreshToken(
        @User() user:UserEntity
    ){
        
        const data =  this.authService.login(user)
        return {
            msg:"Refresh exitoso",data
         }
    }
}

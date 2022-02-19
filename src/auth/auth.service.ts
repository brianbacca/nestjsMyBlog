import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import {compare} from 'bcryptjs'

import { User } from 'src/user/entity';
import { UserService } from 'src/user/user.service';



@Injectable()
export class AuthService {
    constructor(
        private readonly userServices:UserService,
        private readonly jwtService: JwtService
    ){}
    async validateUser(email:string, password:string):Promise<any>{
        const user = await this.userServices.getEmail({email})
        console.log("USER--->",user)
        if(user && await compare(password, user.password) ){
            return user 
        }

        return null
    }

    login(user:User){
        const{id,...rest}=user
        const paylaod = {sub:id};
        return {
            ...rest,
            accesToken: this.jwtService.sign(paylaod)
        }
    }
}

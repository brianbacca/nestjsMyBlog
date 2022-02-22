import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {RolesBuilder,InjectRolesBuilder} from 'nest-access-control'

import { Auth, User } from 'src/common/decarators';
import { CreateUserDto, EditUserDto, UserRegistrationDto } from './dtos';
import { UserService } from './user.service';
import { AppResource, AppRoles } from 'src/app.role';
import { User  as UserEntity} from './entity';



@ApiTags('User')
@Controller('user')
export class UserController {
    
    constructor(
        private readonly userService:UserService,

        @InjectRolesBuilder()
        private readonly rolesBuilder:RolesBuilder
    ){}

    @Get()
    async getMany(){
        const data = await this.userService.getMany()
        return {
            msg:'correct request',data
        }
    }

    @Get(':id')
   async  getOne(
        @Param('id') id:number
    ){
       const data =  await this.userService.getOne(id)
       return data
    }

    @Post('register')
    async publicRegistration(
        @Body() dto:UserRegistrationDto
    ){
       const data =  await this.userService.createOne({
           ...dto, roles:[AppRoles.AUTHOR]
       })

       const {name} =dto
       return{
           msg:`User ${name} registered`, data
       }
    }

    @Auth({
        possession:'own',
        action:'update',
        resource:AppResource.USER
    })
    @Post()
    async createOne(@Body() dto:CreateUserDto){
        const data = await this.userService.createOne(dto)
        return {
            msg: 'User created',data
        }
    }

    @Auth(
        {
            possession:'own',
            action:'update',
            resource:AppResource.USER
        }
    )
    @Put(':id')
    async editOne(
        @Param('id') id:number,
        @Body() dto:EditUserDto,
        @User() user:UserEntity
    ){

        let data

        if(this.rolesBuilder
                .can(user.roles)
                .updateAny(AppResource.USER)
                .granted)
                {
                    //esto es admin
                     data = await this.userService.editOne(id,dto);
                    
        }else {
            //esto es author
            const {roles,...rest}=dto
            data =  await this.userService.editOne(id,rest,user);
            
        }
     
        return {
            msg:'User edit', data 
        }
    }

    @Auth({
        action: 'delete',
        possession: 'own',
        resource: AppResource.USER,
      })
      @Delete(':id')
      async deleteOne(@Param('id') id: number, @User() user: UserEntity) {
        let data;
    
        if (this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted) {
          // esto es un admin
          data = await this.userService.deleteOne(id);
        } else {
          // esto es un author
          data = await this.userService.deleteOne(id, user);
        }
        return { message: 'User deleted', data };
      }
}


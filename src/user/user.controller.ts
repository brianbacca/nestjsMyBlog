import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CreateUserDto, EditUserDto } from './dtos';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    
    constructor(
        private readonly userService:UserService
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

    @Post()
    async createOne(@Body() dto:CreateUserDto){
        const data = await this.userService.createOne(dto)
        return {
            msg: 'User created',data
        }
    }

    @Put(':id')
    async editOne(
        @Param('id') id:number,
        @Body() dto:EditUserDto
    ){
        const data = await this.userService.editOne(id,dto);
        return {
            msg:'User edit', data 
        }
    }

    @Delete(':id')
   async  deleteOne(
        @Param('id') id:number,
        
        ){
            const data = await this.userService.deleteOne(id);
            return {
                msg:'User deleted', data
            }
    }
}

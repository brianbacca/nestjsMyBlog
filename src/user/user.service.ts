import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';



import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto } from './dtos';
import { User } from './entity';


export interface UserFindOne{
    id?:number,
    email?:string
}

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async getMany():Promise<User[]>{
        return await this.userRepository.find()
    }


    async getOne(id:number, userEntity?: User):Promise<User>{
        const user  = await this.userRepository.findOne(id)
        .then(u=>!userEntity ? u : !!u && userEntity.id === u.id ? u : null)
        if(!user) {
            throw new NotFoundException('User does not exists or unauthorize')
    }
    return user;
}


    async createOne(dto:CreateUserDto){
        const userExists = await this.userRepository.findOne({email:dto.email})
        if(userExists){
            throw new BadRequestException('User already registered whith email');
            
        }
        const newuser =  this.userRepository.create(dto)
        const user =  await this.userRepository.save(newuser)

        delete user.password;
        return user;
    }

   async  editOne(id:number, dto:EditUserDto, userEntity?: User){
       const user = await this.getOne(id,userEntity)
       const editUser = Object.assign(user,dto)
       const userEdit = await this.userRepository.save(editUser)
       delete userEdit.password;
       return userEdit;
   }


   async  deleteOne(id:number, userEntity?: User){
       const user = await this.getOne(id,userEntity)
       return this.userRepository.remove(user)
   }

   async getEmail(data:UserFindOne){
return this.userRepository
.createQueryBuilder('user')
.where(data)
.addSelect('user.password')
.getOne()
}

}

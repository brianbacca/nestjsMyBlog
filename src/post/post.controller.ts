import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import {RolesBuilder,InjectRolesBuilder} from 'nest-access-control'
import { AppResource } from 'src/app.role';
import { Auth, User } from 'src/common/decarators';
import {User as UserEntity} from '../user/entity'

import { CreatePostDto, EditPostDto } from './dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService:PostService,
        @InjectRolesBuilder()
        private readonly rolesBuilder:RolesBuilder
        ){}

    @Get()
    async getMany(){
        const data =  await this.postService.getMany()
        return{
            msg:'correct request',data
        }
    }

    @Get(':id')
    getOne(@Param('id',ParseIntPipe) id:number){
        
       return this.postService.getOne(id)
    }

    @Auth({
        resource:AppResource.POST,
        action: 'create',
        possession:'own'
    })
    @Post()
    async createOne(@Body() dto:CreatePostDto,
    @User() author: UserEntity
    ){
        const data  =  this.postService.createOne(dto,author)
        return { message: 'Post created', data };
    }

    @Auth(
        {
            resource: AppResource.POST,
            action: 'update',
            possession: 'own',
          }
    )
    @Put(':id')
   async  editOne(
        @Param('id') id:number,
        @Body() dto:EditPostDto,
        @User() author: UserEntity,
    ){

        let data;

    if (
      this.rolesBuilder.can(author.roles).updateAny(AppResource.POST).granted
    ) {
      // Puede editar cualquier POST...
      data = await this.postService.editOne(id, dto);
    } else {
      // Puede editar solo los propios...
      data = await this.postService.editOne(id, dto, author);
    }

    return { message: 'Post edited', data };
    }

    @Auth({
        resource: AppResource.POST,
        action: 'delete',
        possession: 'own',
      })
    @Delete(':id')
    async deleteOne(
        @Param('id') id:number,
        @User() author: UserEntity
    ){
        let data;

        if (
          this.rolesBuilder.can(author.roles).deleteAny(AppResource.POST).granted
        ) {
          data = await this.postService.deleteOne(id);
        } else {
          data = await this.postService.deleteOne(id, author);
        }
        return { message: 'Post deleted', data };
      }
    }


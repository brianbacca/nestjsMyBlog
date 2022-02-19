import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto, EditPostDto } from './dto';
import { Post } from './entities';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>){}

   async getMany():Promise<Post[]>{
        return await this.postRepository.find()
    }

    async getOne(id:number){
        const One =  await this.postRepository.findOne(id)
        if(!One){
            throw new NotFoundException()
        }

        return One;
    }

    async createOne(dto:CreatePostDto){
        const post = await this.postRepository.create(dto as any);
        return await this.postRepository.save(post)
    }

   async editOne(id:number, dto:EditPostDto){
        const post = await this.postRepository.findOne(id);
        if(!post ){
            throw new NotFoundException('Post does not exist');
        }
        const editPost = Object.assign(post, dto);
        return await this.postRepository.save(editPost)
    }

    async deleteOne(id:number){
        return await this.postRepository.delete(id)
    }

}

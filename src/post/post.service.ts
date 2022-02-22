import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity';
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

    async getOne(id:number, author?: User){
        const post = await this.postRepository
        .findOne(id)
        .then(p => (!author ? p : !!p && author.id === p.author.id ? p : null));
      if (!post)
        throw new NotFoundException('Post does not exist or unauthorized');
      return post;
    }

    async createOne(dto:CreatePostDto, author: User){
        const post = await this.postRepository.create({...dto as any , author});
        return await this.postRepository.save(post)
    }

   async editOne(id:number, dto:EditPostDto, author?: User){
        const post = await this.getOne(id, author);
        if(!post ){
            throw new NotFoundException('Post does not exist');
        }
        const editPost = Object.assign(post, dto);
        return await this.postRepository.save(editPost)
    }

    async deleteOne(id:number,author?: User){
        const post = await this.getOne(id, author);
        return await this.postRepository.remove(post)
    }

}

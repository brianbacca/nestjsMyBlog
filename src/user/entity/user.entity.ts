import { hash } from "bcryptjs";
import { Post } from "src/post/entities";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: 'varchar', length:255,nullable:true})
    name:string;

    @Column({name: 'last_name', type:'varchar', nullable:true})
    lastName:string;

    @Column({type:'varchar', length:128, nullable:true,unique:true})
    email:string;

    @Column({type:'varchar', length:128, nullable:false, select:false})
    password:string;


    @Column({type:'simple-array'})
    roles:string[];

    @Column({type:'boolean', default :true})
    status:boolean;

    @CreateDateColumn({name:'created_at', type:'timestamp'})
    createdAt:Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hasPassword(){
        if(!this.password){
            return;
        }
        this.password = await hash(this.password,10)
    }

    
  @OneToOne(
    _ => Post,
    post => post.author,
    { cascade: true },
  )
  posts: Post;
}

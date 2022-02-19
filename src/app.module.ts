import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {DATABASE_HOST,DATABASE_PORT,DATABASE_USERNAME,DATABASE_PASSWORD,DATABASE_NAME} from './config/constan'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Post } from './post/entities';
import { PostModule } from './post/post.module';
import { User } from './user/entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [   
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        type: 'mysql',
        host: config.get<string>(DATABASE_HOST),
        port: parseInt(config.get<string>(DATABASE_PORT),10),
        username: config.get<string>(DATABASE_USERNAME),
    password: config.get<string>(DATABASE_PASSWORD),
    database: config.get<string>(DATABASE_NAME),
    entities:[Post,User],
    autoLoadEntities:true,
    synchronize: true,
    logging:true,
    logger:'file'
      })
  }),
    PostModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: '.env'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

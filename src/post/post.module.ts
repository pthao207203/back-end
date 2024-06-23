import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { PostT, PostSchema } from './models/post.model';
import { User, UserSchema } from 'src/user/models/user.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: PostT.name, schema: PostSchema }],
      'SunDBConnection',
    ),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema, collection: 'users' }],
      'SunDBConnection',
    ),
    ConfigModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}

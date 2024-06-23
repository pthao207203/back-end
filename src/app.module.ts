import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserController } from './user/controllers/user.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/controllers/auth.controller';
import { PostModule } from './post/post.module';
import { PostController } from './post/controllers/post.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://pthao207203:PThao12345@phuongthao.ikrtmyh.mongodb.net/Sun_db?retryWrites=true&w=majority&appName=PhuongThao',
      {
        connectionName: 'SunDBConnection',
      },
    ),
    PostModule,
    UserModule,
    ConfigModule,
    AuthModule,
  ],
  controllers: [AppController, UserController, AuthController, PostController],
  providers: [AppService],
})
export class AppModule { }

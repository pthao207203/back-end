import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'SunDBConnection',
    ),
    JwtModule.register({
      global: true,
      secret: '123456',
      signOptions: { expiresIn: 60 * 60 },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, User],
  exports: [AuthService],
})
export class AuthModule {}

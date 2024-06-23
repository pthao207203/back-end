import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/models/user.model';
import { RegisterUserDto } from '../dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, 'SunDBConnection')
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(registerUserDto.password);

    const registerUser = new this.userModel({
      ...registerUserDto,
      refresh_token: 'refresh_token_string',
      password: hashPassword,
    });
    return await registerUser.save();
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    console.log('user: ', user);
    if (!user) {
      console.log('User not found');
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!checkPass) {
      console.log('Password incorrect');
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // generate access token and refresh token
    const payload = { id: user.id, email: user.email, role: user.role };
    console.log('role: ', user.role);
    return this.generateToken(payload);
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('SECRET'),
      });
      const checkExistToken = await this.userModel.findOne({
        email: verify.email,
        refresh_token,
      });
      if (checkExistToken) {
        return this.generateToken({
          id: verify.id,
          email: verify.email,
          role: verify.role,
        });
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(payload: {
    id: string;
    email: string;
    role: number;
  }) {
    const id = payload.id;
    const access_token = await this.jwtService.signAsync(payload);
    const role = payload.role;
    const refresh_token = await this.jwtService.signAsync(payload, {
      // secret: this.configService.get<string>('SECRET'),
      // expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
      secret: '12345',
      expiresIn: 60 * 60,
    });
    await this.userModel.updateOne(
      { email: payload.email },
      { refresh_token: refresh_token },
    );
    return { id, access_token, refresh_token, role };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}

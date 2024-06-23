import { ApiProperty } from '@nestjs/swagger';

type NewType = string;

export class RegisterUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  password: NewType;

  @ApiProperty()
  role: number;
}

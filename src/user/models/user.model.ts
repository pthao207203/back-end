import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false })
  _id: string;

  @IsNotEmpty()
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  bio: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 0 })
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging

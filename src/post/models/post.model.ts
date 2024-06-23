import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/user/models/user.model';

export type PostDocument = PostT & Document;

@Schema({ timestamps: true })
export class PostT {
  @Prop({ required: false })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  id_author: User;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop(
    raw({
      type: [
        {
          user: { type: SchemaTypes.ObjectId, ref: 'User' },
          date: { type: Date, default: Date.now },
          content: { type: String },
        },
      ],
    }),
  )
  comments: Record<string, any>;
}

export const PostSchema = SchemaFactory.createForClass(PostT);

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging

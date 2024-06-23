import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, FilterPostDto, UpdatePostDto } from '../dto/post.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostT } from '../models/post.model';
import { User, UserDocument } from 'src/user/models/user.model';
import { UpdateResult, DeleteResult } from 'mongodb';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(User.name, 'SunDBConnection')
    private readonly userModel: Model<UserDocument>,
    @InjectModel(PostT.name, 'SunDBConnection')
    private readonly postModel: Model<PostT>,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto): Promise<PostT> {
    const user = await this.userModel.findById(userId);
    console.log('userId', userId);
    if (!user) {
      console.log('Người dùng không tồn tại');
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }
    try {
      const post = new this.postModel({
        ...createPostDto,
        _id: new mongoose.Types.ObjectId(),
        id_author: userId,
      });
      console.log('postId', post._id);
      return await post.save();
    } catch (error) {
      console.log('err => ', error);
      throw new HttpException('Không thể tạo bài viết', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: FilterPostDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const search = query.search || '';

    const skip = (page - 1) * items_per_page;
    const filter: any = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    };

    const total = await this.postModel.countDocuments(filter);
    const res = await this.postModel
      .find(filter)
      .sort({ date: 'desc' })
      .skip(skip)
      .limit(items_per_page)
      .populate('id_author', 'name imgae bio')
      .exec();

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }

  async findDetail(id: string): Promise<PostT> {
    return await this.postModel.findById(id).populate('id_author', 'name');
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postModel.updateOne({ _id: id }, updatePostDto);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.postModel.deleteOne({ _id: id });
  }
}

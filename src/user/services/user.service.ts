import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dto/user.dto';
import { error } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'SunDBConnection')
    private readonly userModel: Model<User>,
  ) {}
  async findAll(query: FilterUserDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * items_per_page;
    const keyword = query.search || '';
    const [res, total] = await Promise.all([
      this.userModel
        .find({
          $or: [
            { username: { $regex: keyword } },
            { name: { $regex: keyword } },
            { email: { $regex: keyword } },
          ],
        })
        .skip(skip)
        .limit(items_per_page)
        .select('_id username name email')
        .exec(),
      this.userModel
        .countDocuments({
          $or: [
            { username: { $regex: keyword } },
            { name: { $regex: keyword } },
            { email: { $regex: keyword } },
          ],
        })
        .exec(),
    ]);
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        _id: new mongoose.Types.ObjectId(),
        password: hashPassword,
      });
      console.log('chay duoc');
      return await newUser.save();
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async updateAvatar(id: string, avatar: string): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, { avatar }, { new: true })
      .exec();
  }

  async multipleDelete(ids: string[]): Promise<any> {
    console.log('Deleting users with ids:', ids);

    // Kiểm tra xem các _id tồn tại trong cơ sở dữ liệu
    const users = await this.userModel.find({ _id: { $in: ids } }).exec();
    if (users.length !== ids.length) {
      console.log('user => ', users);
      console.log(ids);
      throw new Error('Some users not found');
    }

    // Thực hiện xóa
    const result = await this.userModel
      .deleteMany({ _id: { $in: ids } })
      .exec();
    console.log('Delete result:', result);
    return result;
  }
}

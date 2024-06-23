import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { CreatePostDto, FilterPostDto, UpdatePostDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { PostT } from '../models/post.model';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Sai định dạng. Các định dạng được chấp nhận là: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File quá lớn. File không thể lớn hơn 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async create(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('req:', req['user_data']);
    console.log('dto', createPostDto);
    console.log(file);
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File không hợp lệ');
    }

    try {
      const result = await this.postService.create(req['user_data'].id, {
        ...createPostDto,
        image: 'post/' + file.filename,
      });

      return {
        message: 'Bài viết đã được tạo thành công',
        data: result, // Trả về dữ liệu đã tạo
      };
    } catch (error) {
      throw new BadRequestException('Không thể tạo bài viết', error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: FilterPostDto): Promise<any> {
    return this.postService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findDetail(@Param('id') id: string): Promise<PostT> {
    return this.postService.findDetail(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (file) {
      updatePostDto.image = file.destination + '/' + file.filename;
    }

    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postService.delete(id);
  }

  @Post('ckeupload')
  @UseInterceptors(
    FileInterceptor('upload', {
      storage: storageConfig('ckeditor'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Sai định dạng. Các định dạng được chấp nhận là: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File quá lớn. File không thể lớn hơn 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async ckeUpload(
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('dto', data);
    console.log(file);

    return {
      // eslint-disable-next-line prettier/prettier
      "url": `ckeditor/${file.filename}`,
    };
  }
}

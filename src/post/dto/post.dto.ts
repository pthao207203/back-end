import { User } from 'src/user/models/user.model';

export class CreatePostDto {
  title: string;

  id_author: User;

  date: Date;

  content: string;

  tags: string[];

  image: string;
}

export class FilterPostDto {
  page: string;

  items_per_page: string;

  search: string;

  category: string;
}

export class UpdatePostDto {
  title: string;

  id_author: User;

  date: Date;

  content: string;

  tags: string[];

  image: string;
}

export class CreateUserDto {
  username: string;
  name: string;
  avatar: string;
  email: string;
  bio: string;
  password: string;
}

export class FilterUserDto {
  page: string;
  items_per_page: string;
  search: string;
}

export class UpdateUserDto {
  _id: string;
  username: string;
  name: string;
  avatar: string;
  email: string;
  bio: string;
  password: string;
}

import { IsEmail, IsString } from 'class-validator';

export class UpdateUser {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  isAdmin?: boolean;
}

export type UpdateUserDto = Partial<UpdateUser>;

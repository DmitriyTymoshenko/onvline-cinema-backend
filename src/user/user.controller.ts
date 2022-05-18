import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { idValidationPipe } from '../pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto);
  }

  @Get('profile/favorites')
  @Auth()
  async getFavorites(@User('_id') _id: Types.ObjectId) {
    return this.userService.getFavoriteMovies(_id);
  }

  @Put('profile/favorites')
  @Auth()
  async toggleFavorites(
    @Body('movieId') movieId: Types.ObjectId,
    @User() user: UserModel,
  ) {
    return this.userService.toggleFavorites(movieId, user);
  }

  // admin

  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount();
  }

  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAll(searchTerm);
  }

  @UsePipes(new ValidationPipe())
  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', idValidationPipe) id: string) {
    return this.userService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth('admin')
  async updateUser(
    @Param('id', idValidationPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @Delete(':id')
  @HttpCode(204)
  @Auth('admin')
  async deleteUser(@Param('id', idValidationPipe) id: string) {
    return this.userService.delete(id);
  }
}

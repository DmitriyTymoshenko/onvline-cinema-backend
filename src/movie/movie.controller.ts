import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { idValidationPipe } from '../pipes/id.validation.pipe';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.movieService.bySlug(slug);
  }

  @Get('by-actor/:actorId')
  async byActor(@Param('actorId', idValidationPipe) actorId: Types.ObjectId) {
    return this.movieService.byActor(actorId);
  }

  @UsePipes(new ValidationPipe())
  @Post('by-genres')
  async byGenres(@Body('genreIds') genreIds: Types.ObjectId[]) {
    return this.movieService.byGenres(genreIds);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAll(searchTerm);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @Put('update-count-opened')
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  // Admin
  @Get(':id')
  @Auth('admin')
  async get(@Param('id', idValidationPipe) id: string) {
    return this.movieService.byId(id);
  }
  @UsePipes(new ValidationPipe())
  @Post()
  @Auth('admin')
  async create() {
    return this.movieService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', idValidationPipe) id: string,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.movieService.update(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @Delete(':id')
  @HttpCode(204)
  @Auth('admin')
  async deleteUser(@Param('id', idValidationPipe) id: string) {
    return this.movieService.delete(id);
  }
}

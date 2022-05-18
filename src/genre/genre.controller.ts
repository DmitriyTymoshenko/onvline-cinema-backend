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
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug);
  }

  @Get('collections')
  async getCollections() {
    return this.genreService.getCollections();
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAll(searchTerm);
  }

  // Admin

  @Get(':id')
  @Auth('admin')
  async get(@Param('id', idValidationPipe) id: string) {
    return this.genreService.byId(id);
  }
  @UsePipes(new ValidationPipe())
  @Post()
  @Auth('admin')
  async create() {
    return this.genreService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', idValidationPipe) id: string,
    @Body() dto: CreateGenreDto,
  ) {
    return this.genreService.update(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @Delete(':id')
  @HttpCode(204)
  @Auth('admin')
  async deleteUser(@Param('id', idValidationPipe) id: string) {
    return this.genreService.delete(id);
  }
}

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
import { ActorService } from './actor.service';
import { ActorDto } from './actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.actorService.bySlug(slug);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.actorService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id', idValidationPipe) id: string) {
    return this.actorService.byId(id);
  }
  @UsePipes(new ValidationPipe())
  @Post()
  @Auth('admin')
  async create() {
    return this.actorService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', idValidationPipe) id: string,
    @Body() dto: ActorDto,
  ) {
    return this.actorService.update(id, dto);
  }

  @UsePipes(new ValidationPipe())
  @Delete(':id')
  @HttpCode(204)
  @Auth('admin')
  async deleteUser(@Param('id', idValidationPipe) id: string) {
    return this.actorService.delete(id);
  }
}

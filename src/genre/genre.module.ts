import { forwardRef, Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { GenreModel } from './genge.model';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: {
          collection: 'Genre',
        },
      },
    ]),
    forwardRef(() => MovieModule),
  ],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}

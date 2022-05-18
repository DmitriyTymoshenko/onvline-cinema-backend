import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { MovieModel } from './movie.model';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService: TelegramService,
  ) {}

  async getAll(searchTerm?: string) {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.MovieModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .exec();
  }

  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({ slug })
      .populate('actors genres')
      .exec();
    console.log('BY SLUG', doc);
    if (!doc) throw new NotFoundException('Actor not found');
    return doc;
  }

  async byActor(actorId: Types.ObjectId) {
    const doc = await this.MovieModel.find({ actors: actorId }).exec();
    if (!doc) throw new NotFoundException('Actor not found');
    return doc;
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const docs = await this.MovieModel.find({
      genres: { $in: genreIds },
    }).exec();

    if (!docs) throw new NotFoundException('Genre not found');
    return docs;
  }

  async updateCountOpened(slug: string) {
    const updateDoc = await this.MovieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      },
      {
        new: true,
      },
    ).exec();
    if (!updateDoc) throw new NotFoundException('Could not update Count');
    return updateDoc;
  }

  async getMostPopular() {
    return await this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec();
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.MovieModel.findByIdAndUpdate(
      id,
      {
        rating: newRating,
      },
      {
        new: true,
      },
    ).exec();
  }

  /*
  Only Admin
   */

  async byId(_id: string) {
    const movie = await this.MovieModel.findById(_id);
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    };

    const movie = await this.MovieModel.create(defaultValue);
    return movie._id;
  }

  async update(_id: string, dto: UpdateMovieDto) {
    console.log('dto', dto);
    console.log('isSendTelegram', dto.isSendTelegram);
    if (!dto.isSendTelegram) {
      const movie: any = await this.bySlug(dto.slug);
      console.log('movie', movie);
      await this.telegramService.sendNotification(movie);
      dto.isSendTelegram = true;
    }
    const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();
    if (!updateDoc) throw new NotFoundException('Genre not found');
    return updateDoc;
  }

  async delete(id: string) {
    const deleteGenre = await this.MovieModel.findByIdAndDelete(id);
    if (!deleteGenre) throw new NotFoundException('Genre not found');
    return deleteGenre;
  }

  async sendNotification(dto: UpdateMovieDto) {
    // if (process.env.NODE_ENV !== 'development')
    // await this.telegramService.sendPhoto(dto.poster);
    // await this.telegramService.sendPhoto(
    //   'https://ichef.bbci.co.uk/news/640/cpsprodpb/367C/production/_124084931_gettyimages-1388090285.jpg',
    // );
    //
    // const msg = `<b>${dto.title}</b>`;
    //
    // await this.telegramService.sendMessage(msg, {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [
    //         {
    //           url: 'https://ichef.bbci.co.uk/news/640/',
    //           text: 'Go to watch',
    //         },
    //       ],
    //     ],
    //   },
    // });
  }
}

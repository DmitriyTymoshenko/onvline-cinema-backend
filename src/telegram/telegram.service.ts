import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { getTelegramConfig } from 'src/config/telegram.config';
import { Telegraf } from 'telegraf';
import { Telegram } from './telegram.interface';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { MovieService } from '../movie/movie.service';
import { APP_URL } from '../constants/constants';
import Context from 'telegraf/typings/context';
import { UpdateMovieDto } from '../movie/dto/update-movie.dto';
import { ActorService } from '../actor/actor.service';
import { ActorDto } from '../actor/actor.dto';
import { CreateGenreDto } from '../genre/dto/create-genre.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { TelegramUserModel } from './user/telegram.user.model';
import { TelegramUserDto } from './user/telegram.user.dto';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  options: Telegram;

  constructor(
    @Inject(forwardRef(() => MovieService))
    private readonly movieService: MovieService,
    private readonly actorService: ActorService,
    @InjectModel(TelegramUserModel)
    private readonly TelegramUserModel: ModelType<TelegramUserModel>,
  ) {
    this.options = getTelegramConfig();
    this.bot = new Telegraf(this.options.token);
  }

  public async launch(): Promise<void> {
    this.bot.command('/films', async (ctx) => {
      const user = this.getUser(ctx);
      const movies = await this.movieService.getAll();
      movies.slice(0, 5).forEach((m: any): void => {
        this.sendFilmMarkup(m, String(user.id));
      });
    });
    this.bot.command('/actors', async (ctx) => {
      const user = this.getUser(ctx);
      const movies = await this.actorService.getAll();
      movies.slice(0, 5).forEach((a: any): void => {
        this.createActorMarkup(a, String(user.id));
      });
    });
    // this.bot.command('/genres', async (ctx) => {
    //   const user = this.getUser(ctx);
    //   const movies = await this.genreService.getAll();
    //   movies.slice(0, 5).forEach((m: any): void => {
    //     this.createGenreMarkup(m, String(user.id));
    //   });
    // });
    await this.bot.launch();
  }

  setFilmsContentMarkup(items: any[], title: string) {
    return `<pre><b>${title}:</b> ${items.map(
      (item: any) => `<i>${item.name}</i>`,
    )} </pre>`;
  }

  async sendFilmMarkup(m: UpdateMovieDto, id: string) {
    const msg = `<a href="${m.poster}"><b>🎥 ${m.title}</b>
${this.setFilmsContentMarkup(m.actors, 'Actors')}
${this.setFilmsContentMarkup(m.genres, 'Genres')}
</a>`;
    await this.bot.telegram.sendMessage(
      id,
      msg,
      this.setOptions(this.setReplyButton(`movie/${m.slug}`)),
    );
  }

  async createActorMarkup(a: ActorDto, id: string) {
    const msg = `<a href="${a.photo}"><b>🎥 ${a.name}</b>
</a>`;
    await this.bot.telegram.sendMessage(
      id,
      msg,
      this.setOptions(this.setReplyButton(`actor/${a.slug}`)),
    );
  }

  async createGenreMarkup(g: CreateGenreDto, id: string) {
    const msg = `<pre><b>🎥 ${g.name}</b></pre>`;
    await this.bot.telegram.sendMessage(
      id,
      msg,
      this.setOptions(this.setReplyButton(`genre/${g.slug}`)),
    );
  }

  getUser(ctx: Context) {
    if ('message' in ctx.update) {
      const user = ctx.update.message.from;
      this.addUserToDB(user);
      return user;
    }
    return null;
  }

  async getAllUsers() {
    return await this.TelegramUserModel.find().exec();
  }

  async sendNotification(movie: UpdateMovieDto) {
    const users: TelegramUserDto[] = await this.getAllUsers();
    if (users) {
      users.forEach((user) => this.sendFilmMarkup(movie, user.id));
    }
  }

  async addUserToDB(user) {
    const DbUser = await this.TelegramUserModel.findOne({
      id: String(user.id),
    });
    console.log('DbUser', DbUser);
    if (!DbUser) {
      await this.TelegramUserModel.create(user);
    }
  }

  setOptions(options?: ExtraReplyMessage): ExtraReplyMessage {
    return {
      parse_mode: 'HTML',
      ...options,
    };
  }

  setReplyButton(link: string, text = 'Go to watch'): ExtraReplyMessage {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: `${APP_URL}${link}`,
              text: text,
            },
          ],
        ],
      },
    };
  }
}

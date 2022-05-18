import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { getTelegramConfig } from 'src/config/telegram.config';
import { Telegraf } from 'telegraf';
import { Telegram } from './telegram.interface';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  options: Telegram;

  constructor(
    @Inject(forwardRef(() => MovieService))
    private readonly movieService: MovieService,
  ) {
    this.options = getTelegramConfig();
    this.bot = new Telegraf(this.options.token);
  }

  public async launch(): Promise<void> {
    this.bot.start((ctx) => {
      console.log(ctx.update.message.from);
    });
    this.bot.help((ctx) => ctx.reply('Send me a sticker'));
    this.bot.on('sticker', (ctx) => ctx.reply('👍'));
    this.bot.hears('hi', (ctx) => ctx.reply('Hey there'));
    this.bot.command('oldschool', (ctx) => ctx.reply('Hello'));
    this.bot.command('hipster', Telegraf.reply('λ'));
    this.bot.command('films', async (ctx) => {
      const user = ctx.update.message.from;
      const { id } = user;
      const result = await this.movieService.getAll();
      result.slice(0, 5).forEach((m) => {
        const msg = `<a href="${m.poster}"><b>🎥 ${m.title}</b>
<pre><b>Actors:</b> ${m.actors.map((a: any) => `<i>${a.name}</i>`)} </pre>
<pre><b>Genges:</b> ${m.genres.map((g: any) => `<i>${g.name}</i>`)} </pre>
</a>`;
        const options = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  url: m.videoUrl,
                  text: 'Go to watch',
                },
              ],
            ],
          },
        };
        // this.sendPhoto(String(id), m.poster);
        this.sendMessage(String(id), msg, options);
      });
    });
    await this.bot.launch();
  }

  async sendMessage(chatId: string, msg: string, options?: ExtraReplyMessage) {
    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: 'HTML',
      ...options,
    });
  }

  async sendPhoto(chatId: string, photo: string, msg?: string) {
    await this.bot.telegram.sendPhoto(
      chatId,
      photo,
      msg
        ? {
            caption: msg,
          }
        : {},
    );
  }
}

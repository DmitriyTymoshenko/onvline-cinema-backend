import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { MovieModule } from '../movie/movie.module';
// import { GenreModule } from 'src/genre/genre.module';
import { ActorModule } from '../actor/actor.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { TelegramUserModel } from './user/telegram.user.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TelegramUserModel,
        schemaOptions: {
          collection: 'TelegramUser',
        },
      },
    ]),
    forwardRef(() => MovieModule),
    ActorModule,
    // forwardRef(() => GenreModule),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule implements OnModuleInit {
  constructor(private readonly telegramService: TelegramService) {}

  async onModuleInit() {
    await this.telegramService.launch();
  }
}

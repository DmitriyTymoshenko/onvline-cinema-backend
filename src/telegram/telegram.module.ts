import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [forwardRef(() => MovieModule)],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule implements OnModuleInit {
  constructor(private readonly telegramService: TelegramService) {}

  async onModuleInit() {
    await this.telegramService.launch();
  }
}

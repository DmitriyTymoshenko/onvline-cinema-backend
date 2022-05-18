import { IsString, IsBoolean } from 'class-validator';

export class TelegramUserDto {
  @IsString()
  id: string;

  @IsBoolean()
  is_bot: boolean;

  @IsString()
  first_name: string;

  username?: string;

  @IsString()
  language_code: string;
}

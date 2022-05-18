import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';

export class TelegramUserModel extends TimeStamps {
  @prop({ unique: true })
  id: string;

  @prop()
  is_bot: boolean;

  @prop()
  first_name: string;

  @prop()
  username?: string;

  @prop()
  language_code: string;
}

import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class GenreModel extends TimeStamps {
  _id: Types.ObjectId;

  @prop()
  name: string;

  @prop({ unique: true })
  slug: string;

  @prop()
  description: string;

  @prop()
  icon: string;
}

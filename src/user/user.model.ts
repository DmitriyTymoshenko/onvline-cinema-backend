import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';
import { MovieModel } from 'src/movie/movie.model';

export class UserModel extends TimeStamps {
  _id: ObjectId;
  @prop({ unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ default: false })
  isAdmin: boolean;

  @prop({ default: [], ref: () => MovieModel })
  favorites?: Ref<MovieModel>[];
}

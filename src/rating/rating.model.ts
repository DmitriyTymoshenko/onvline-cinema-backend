import { ObjectId } from 'mongoose';
import { prop, Ref } from '@typegoose/typegoose';
import { UserModel } from '../user/user.model';
import { MovieModel } from 'src/movie/movie.model';

export class RatingModel {
  _id: ObjectId;
  @prop({ ref: () => UserModel, required: true })
  userId: Ref<UserModel>;

  @prop({ ref: () => MovieModel, required: true })
  movieId: Ref<MovieModel>;

  @prop()
  value: number;
}

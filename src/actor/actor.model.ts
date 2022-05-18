import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';

export class ActorModel extends TimeStamps {
  _id: ObjectId;
  @prop()
  name: string;

  @prop({ unique: true })
  slug: string;

  @prop()
  photo: string;
}

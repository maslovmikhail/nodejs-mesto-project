import { model, Schema } from 'mongoose';

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      minlength: [2, 'Имя должно содержать не менее 2 символов'],
      maxlength: [30, 'Имя должно содержать не более 30 символов'],
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        default: undefined,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true },
);

export default model<ICard>('card', cardSchema);

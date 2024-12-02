import { model, Schema } from "mongoose";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: [2, "Имя должно содержать не менее 2 символов"],
      maxlength: [30, "Имя должно содержать не более 30 символов"],
      required: true,
    },
    about: {
      type: String,
      minlength: [2, "Описание должно содержать не менее 2 символов"],
      maxlength: [200, "Описание должно содержать не более 200 символов"],
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model<IUser>("user", userSchema);

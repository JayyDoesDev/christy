import { Schema, Document, model } from "mongoose";

interface UserDocument extends Document {
  User: string;
  presentCount: number;
  candyCount: number;
}

const UserModel: Schema = new Schema(
  {
    User: String,
    presentCount: { type: Number, default: 0 },
    candyCount: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    strict: true
  }
);

export = model<UserDocument>("users", UserModel);

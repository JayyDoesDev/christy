import { Schema, Document, model } from "mongoose";

interface UserDocument extends Document {
  User: string;
  presentCount: number;
  candyCount: number;
  snowballCount: number;
  blackListed: boolean;
}

const UserModel: Schema = new Schema(
  {
    User: String,
    presentCount: { type: Number, default: 0 },
    candyCount: { type: Number, default: 0 },
    snowballCount: { type: Number, default: 0 },
    blackListed: { type: Boolean, default: false }
  },
  {
    versionKey: false,
    strict: true
  }
);

export = model<UserDocument>("users", UserModel);

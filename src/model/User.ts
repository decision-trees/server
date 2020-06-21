import { Schema, model } from 'mongoose';

export interface User {
  username: String;
  email: String;
  name: String;
  firstname: String;
  registered: Date;
  created: Date;
  modified: Date;
}

const UserSchema = new Schema(
  {
    subject: { type: String, unique: true },
    audience: { type: String, index: true },
    email: String,
    name: String,
    firstname: String,
    permissions: [String],
  },
  {
    timestamps: true,
  }
);
UserSchema.index({ username: 1, password: 1 }, { name: 'username_password' });

export default model('User', UserSchema, 'users');

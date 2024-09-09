import { Model } from 'mongoose';

export interface TaskMutation {
  user: string;
  title: string;
  description: string;
  status: string;
}

export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;
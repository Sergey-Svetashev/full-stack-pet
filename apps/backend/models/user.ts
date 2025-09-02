import { calculateAge } from "../utils/dates.ts";
import { GenericError } from "./errors.ts";
import { Status } from "oak/mod.ts";

type UserEntry = {
  username: string;
  uid: string;
};

type UserProfile = {
  userUid: string;
  address: string;
  birthdate: string;
};

interface IUser {
  permission: () => boolean;
}

export class User implements IUser {
  constructor(
    public email: string,
    public name: string,
    public birthDate: string,
    public address?: string,
    public text?: string
  ) {}

  public static async get(token: string): Promise<User | void> {
    
  }

  public permission(): boolean {
    const age = calculateAge(this.birthDate);

    return age >= 10;
  }
}

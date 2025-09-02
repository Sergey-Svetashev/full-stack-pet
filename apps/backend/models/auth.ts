import { JWTPayload } from "jose";
import type { Db } from "mdb";
import { Status } from "oak_commons/status.ts";
import {
  PASSWORD_ERR_MESSAGE,
  REFRESH_ERR_MESSAGE,
  USER_EXIST_ERR_MESSAGE,
} from "../utils/constants.ts";
import { GenericError } from "./errors.ts";
import type { TokenGeneration } from "./token.ts";

// 400 BadRequest
// 401 Unauthorized
// 403 Forbidden

type User = { email: string; password: string };
type SignedInfo = { user: User; accessToken: string; refreshToken: string };

interface Authentication {
  signUp: (email: string, password: string) => Promise<unknown>;
  signIn: (email: string, password: string) => Promise<SignedInfo>;
  accessCheck: (accessToken: string) => Promise<JWTPayload>;
}

export class AuthService implements Authentication {
  private static readonly encoder = new TextEncoder();
  private static readonly decoder = new TextDecoder("utf-8");

  constructor(
    private readonly db: Db,
    private readonly tokenService: TokenGeneration
  ) {}

  private async hash(source: string): Promise<string> {
    const encodedSource = AuthService.encoder.encode(source);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedSource);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  public async signUp(email: string, password: string): Promise<void> {
    const users = this.db.collection<User>("auth");
    const user = await users.findOne({ email });

    if (!user) {
      const hashedPassword = await this.hash(password);

      await users.insertOne({
        // TODO: make _id as ObjectId(email)
        email,
        password: hashedPassword,
      });
    } else {
      throw new GenericError(Status.Unauthorized, USER_EXIST_ERR_MESSAGE);
    }
  }

  public async signIn(email: string, password: string): Promise<SignedInfo> {
    const users = this.db.collection<User>("auth");
    const user = await users.findOne({ email });

    if (user) {
      const pass = await this.hash(password);

      if (user.password === pass) {
        const { accessToken, refreshToken } =
          await this.tokenService.generateRefreshAccess({ email });

        await users.findOneAndUpdate(
          { email },
          { $set: { refreshToken } },
          { returnDocument: "after" }
        );

        return { user, accessToken, refreshToken };
      } else {
        throw new GenericError(Status.Unauthorized, PASSWORD_ERR_MESSAGE);
      }
    } else {
      throw new GenericError(Status.Forbidden);
    }
  }

  public async accessCheck(accessToken: string) {
    try {
      const { payload } = await this.tokenService.verify(accessToken, {
        isAccess: true,
      });

      return payload;
    } catch (e) {
      // TODO: check error & send a custom error message if expired token
      throw new GenericError(Status.Unauthorized, "", e);
    }
  }

  public async refreshAccess(refreshToken: string) {
    try {
      const { payload } = await this.tokenService.verify(refreshToken);

      return payload;
    } catch (e) {
      console.log('------------ ! ', e)
      throw new GenericError(Status.Forbidden, REFRESH_ERR_MESSAGE, e);
    }
  }
}

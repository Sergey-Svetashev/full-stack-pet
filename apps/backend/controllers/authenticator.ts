import type { Context, Next } from "oak/mod.ts";
import { Status } from "oak_commons/status.ts";
import { AuthService } from "../models/auth.ts";
import { TokenService } from "../models/token.ts";
import { db } from "../utils/db.ts";
import { GenericError } from "../models/errors.ts";
import { COOKIE_KEY } from "../utils/constants.ts";

const tokenService = new TokenService();
const authService = new AuthService(db, tokenService);

export const signUp = async ({ request, response }: Context, next: Next) => {
  const { email, password } = await request.body.json();
  await authService.signUp(email, password);

  response.status === Status.OK;
  response.body = JSON.stringify({ email });

  return next();
};

export const signIn = async (
  { request, response, cookies }: Context,
  next: Next
) => {
  const { email, password } = await request.body.json();
  const { user, accessToken, refreshToken } = await authService.signIn(
    email,
    password
  );

  cookies.set(COOKIE_KEY, refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    secure: false,
  })
  response.body = JSON.stringify({ email: user.email, accessToken });

  return next();
};

export const accessProcess = async (
  { request, response, cookies }: Context,
  next: Next
) => {
  /**
   * TODO:
   *
   * check the access token
   * check refresh token & get access token
   */

  const accessToken = request.headers.get("Authorization")?.split(" ")[1];
  const refreshToken = await cookies.get(COOKIE_KEY);

  try {
    if (accessToken) {
      const { email } = await authService.accessCheck(accessToken);

      response.body = JSON.stringify({ email, accessToken });
       response.status = 200;
    }

    if (!accessToken && refreshToken) {
      const { email } = await authService.refreshAccess(refreshToken);

      const { accessToken: updatedAccess, refreshToken: updatedRefresh } =
        await tokenService.generateRefreshAccess({ email });

      response.body = JSON.stringify({
        email,
        accessToken: updatedAccess,
      });
      cookies.set(COOKIE_KEY, updatedRefresh);
       response.status = 200;
    }

    if(!accessToken && !refreshToken) {
        throw new GenericError(Status.Unauthorized)
    }

   
  } catch (e) {
    if (e instanceof GenericError) {
      throw e;
    } else {
      throw new GenericError(Status.InternalServerError);
    }
  }

  // response.status = 303;
  // response.headers.set("Location", "http://localhost:4321");

  await next();
};

import { Context, Status } from "oak/mod.ts";
import { GenericError } from "../models/errors.ts";

export const errorHandle = async (
  { response }: Context,
  next: () => Promise<unknown>
) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof GenericError) {
      response.status = error.statusCode;

      switch (error.statusCode) {
        case Status.NotFound:
          response.body = { message: error.message || "Not found a resource." };
          break;
        case Status.Forbidden:
          response.body = {
            message: error.message || "User does not exist. Please register.",
          };
          break;
        case Status.UnavailableForLegalReasons:
          response.body = {
            message:
              error.message ||
              "User is not allowed to proceed as he is too young.",
          };
          break;
        case Status.Unauthorized:
          response.body = {
            message: error.message || "Unauthorized. Please Sign In.",
          };
          break;
        default:
          response.status = Status.InternalServerError;
          response.body = {
            message: error.message || "Unhandled server error.",
          };
      }
    } else {
      console.log({ cause: error });

      response.status = Status.InternalServerError;
      response.body = { message: "Unexpected error. Please try again later." };
    }
  }
};

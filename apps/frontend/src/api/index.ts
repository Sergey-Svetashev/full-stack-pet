import { ApiError } from "../errors.ts";
import { FormData } from "../models/index.ts";

const BASE_URL = "http://localhost:8081"; // TODO

export const signHandler = async (
  data: FormData,
  path: "signup" | "signin"
): Promise<{ email: string; accessToken?: string }> => {
  const response = await fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (response.status !== 200) {
    throw new ApiError(result.message, response.status);
  }
  return result;
};

export const accessCheck = async (
  accessToken: string | null
): Promise<{ email: string; accessToken: string }> => {
  const response = await fetch(`${BASE_URL}/access-check`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  const result = await response.json();
  if (response.status !== 200) {
    throw new ApiError(result.message, response.status);
  }
  return result;
};

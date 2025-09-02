import type { JWTVerifyResult } from "npm:jose";
import { SignJWT, jwtVerify } from "npm:jose";

const accessSecret = Deno.env.get("JWT_ACCESS_SECRET");
const refreshSecret = Deno.env.get("JWT_REFRESH_SECRET");

export interface TokenGeneration {
  generateRefreshAccess: (
    payload: Record<string, string>
  ) => Promise<{ accessToken: string; refreshToken: string }>;
  verify: (
    token: string,
    options?: { isAccess: boolean }
  ) => Promise<JWTVerifyResult<{ email: string }>>;
}

export class TokenService implements TokenGeneration {
  private readonly encoder = new TextEncoder();
  private readonly encodedAccessSecret: Uint8Array =
    this.encoder.encode(accessSecret);
  private readonly encodedRefreshSecret: Uint8Array =
    this.encoder.encode(refreshSecret);

  constructor() {}

  async generateRefreshAccess(
    payload: Record<string, string>
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const signer = new SignJWT(payload);

    const accessToken = await signer
      .setExpirationTime("5m")
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.encodedAccessSecret);
      
    const refreshToken = await signer
      .setExpirationTime("10d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.encodedRefreshSecret);

    return { accessToken, refreshToken };
  }

  verify(
    token: string,
    options?: { isAccess: boolean }
  ): Promise<JWTVerifyResult<{ email: string }>> {
    const secret = options?.isAccess
      ? this.encodedAccessSecret
      : this.encodedRefreshSecret;
    return jwtVerify(token, secret);
  }
}

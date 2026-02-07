import jwt, { JwtPayload } from "jsonwebtoken"
import { access, refresh } from "./key"

const secretMap = {
  access,
  refresh,
} as const;

export default (verify: {
  token: string;
  option: keyof typeof secretMap;
}): JwtPayload => {
  try {
    return jwt.verify(verify.token, secretMap[verify.option]) as JwtPayload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Token verification failed: ${message}`);
  }
};




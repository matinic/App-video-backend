// types/express.d.ts
import { UserDto } from "./lib/dto/user"

declare global {
  namespace Express {
    interface Request {
      user: UserDto.AuthUserDto,
      validatedBody?: any,
      validatedParams?: any,
      validatedQuery?: any,
    }
  }
}

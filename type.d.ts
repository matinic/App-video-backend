// types/express.d.ts
import { UserDto } from "@/utils/validations/user/dto"

declare global {
  namespace Express {
    interface Request {
      user: UserDto.AuthUserDto,
      validatedQuery: any
    }
  }
}

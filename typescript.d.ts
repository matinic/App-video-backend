import { UserDto } from "@/lib/validations/user/dto"

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
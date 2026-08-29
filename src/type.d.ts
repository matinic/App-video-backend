import { UserDto } from "./lib/zod/dto/user"
declare global{
  namespace Express {
    interface Request {
      user: UserDto.UserAuthDto,
      validatedBody?: any,
      validatedParams?: any,
      validatedQuery?: any,
    }
  }
}


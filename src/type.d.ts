import { UserDto } from "./lib/zod.schemas/user.schema"
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


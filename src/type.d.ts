// types/express.d.ts
  namespace Express {
    interface Request {
      user: UserDto.AuthUserDto,
      validatedBody?: any,
      validatedParams?: any,
      validatedQuery?: any,
    }
  }


# AI Coding Guidelines for Video Platform API

## Architecture Overview
This is a Node.js/Express TypeScript API for a video sharing platform with user authentication, video uploads, comments, notifications, and playlists. Key components:

- **Controllers** (`src/controllers/`): Handle HTTP requests/responses, delegate to services
- **Services** (`src/services/`): Business logic and database operations via Prisma
- **Routes** (`src/routes/`): Route definitions with validation and auth middleware
- **Validations** (`src/lib/validations/`): Zod schemas for request validation
- **Utils** (`src/lib/`): JWT handling, bcrypt, Prisma client, model helpers

Data flows: Authenticated requests → validation → controller → service → Prisma DB → formatted response with notifications triggered.

## Key Patterns & Conventions

### Import Paths
Use `@/` for `src/` imports (configured in `tsconfig.json`). Avoid relative paths like `../src/`. Example:
```typescript
import userService from "@/services/user.service";
import { UserDto } from "@/lib/validations/user/dto";
```

### Error Handling
Controllers catch errors and return JSON responses. Services throw errors for controllers to handle:
```typescript
// Controller pattern
try {
  const result = await service.method(data);
  res.status(200).json({ message: "Success", data: result });
} catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  }
}
```

### Authentication
JWT-based with access/refresh tokens. Use `auth()` middleware on protected routes. `req.user` contains decoded user data (id, name, etc.).

### Database
Prisma with PostgreSQL. Models: User, Video, Comment, Notification, Playlist, etc. Run `npx prisma generate` after schema changes. Use transactions for multi-table operations.

### Notifications
Complex system with emitters, destinations, and types. Notifications link to videos/comments/messages. Use `notificationFormat` helper for response formatting.

### Validation
Zod schemas in `src/lib/validations/`. Base schemas reused across features. Validate requests with `validate()` middleware.

## Development Workflows

### Running the App
- `npm run dev`: Starts with nodemon/tsx (hot reload)
- `npm start`: Runs compiled code from `dist/`
- Server listens on `PORT` env var (default 3000)

### Testing
- `npm test`: Run all Jest tests
- `npm run test:unit`: Unit tests only
- `npm run test:integration`: Integration tests
- `npm run test:e2e`: End-to-end tests
- Tests in `test/` with setup in `test/setup.ts`

### Database
- `npx prisma migrate dev`: Apply migrations in development
- `npx prisma studio`: Open Prisma Studio for DB inspection
- `npx prisma generate`: Regenerate Prisma client after schema changes

### Building
No explicit build script - uses tsx for development. For production, compile with `tsc` to `dist/`.

## Common Pitfalls
- Inconsistent import paths (some files use `../src/` instead of `@/`)
- Routes not imported in `src/app.ts` (add `app.use('/api', router)` from `src/routes/index.ts`)
- Prisma client import from `"generated/prisma"` - ensure `npx prisma generate` after pulls
- Empty test files - implement tests following Jest patterns
- Notification relations are complex - reference `prisma/schema.prisma` for foreign keys

## External Dependencies
- **Prisma**: ORM with PostgreSQL adapter
- **Zod**: Schema validation
- **JWT**: Token-based auth
- **bcrypt**: Password hashing
- **Cloudinary**: Image/video uploads (v2 API)
- **Express middleware**: helmet, cors, morgan, cookie-parser
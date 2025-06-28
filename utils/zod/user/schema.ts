import { z } from "zod"

export default {
    getUsersSchema: z.object({
        amount: z.coerce.number().default(20),
        page: z.coerce.number().default(1),
        orderBy: z.enum(["asc","desc"]).default("asc")
    }),
    createUserSchema: z.object({
        name: z.string().max(16),
        email: z.string().email(),
        password: z.string().max(32)
    }),
    getSessionSchema: z.object({
        nameOrEmail: z.string(),
        password: z.string(),
    }),
    userIdSchema: z.object({
        userId: z.string().uuid(),
    }),
    emailSchema: z.string().email(),
    nameSchema: z.string().max(16),
    passwordSchema: z.string().max(32),
    updateTokenSchema: z.object({
        refreshToken: z.string().uuid(),
        userId: z.string().uuid()
    }),
    subscriptionSchema: z.object({
        userId: z.string().uuid(),
        channelId: z.string().uuid(),
        subscriptionStatus: z.enum(["subscribe","unsubscribe"])
    })
}



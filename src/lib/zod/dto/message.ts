// src/lib/zod/dto/message.ts
import { z } from "zod"
import * as messageSchema from "../schemas/message"

export namespace MessageDto {
    export type CreateMessageDto = z.infer<typeof messageSchema.createMessageSchema>
    export type UpdateMessageDto = z.infer<typeof messageSchema.updateMessageSchema>
    export type GetMessageByIdDto = z.infer<typeof messageSchema.getMessageByIdSchema>
    export type DeleteMessageDto = z.infer<typeof messageSchema.deleteMessageSchema>
    export type GetConversationDto = z.infer<typeof messageSchema.getConversationSchema>
    export type GetUserMessagesDto = z.infer<typeof messageSchema.getUserMessagesSchema>
}
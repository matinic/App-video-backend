// src/lib/zod/schemas/playlist.ts
import { z } from "zod"
import { idSchema, paginationSchema } from "./base.schema"

const nameSchema = z.string().min(1).max(255)
const descriptionSchema = z.string().max(1000).optional()

export const createPlaylistSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
})

export const updatePlaylistSchema = z.object({
    id: idSchema,
    name: nameSchema.optional(),
    description: descriptionSchema,
})

export const getPlaylistByIdSchema = z.object({
    id: idSchema,
})

export const deletePlaylistSchema = z.object({
    id: idSchema,
})

export const addVideoToPlaylistSchema = z.object({
    playlistId: idSchema,
    videoId: idSchema,
})

export const removeVideoFromPlaylistSchema = z.object({
    playlistId: idSchema,
    videoId: idSchema,
})

export const getUserPlaylistsSchema = z.object({
    ...paginationSchema,
})

export namespace PlaylistDto {
    export type CreatePlaylistDto = z.infer<typeof createPlaylistSchema>
    export type UpdatePlaylistDto = z.infer<typeof updatePlaylistSchema>
    export type GetPlaylistByIdDto = z.infer<typeof getPlaylistByIdSchema>
    export type DeletePlaylistDto = z.infer<typeof deletePlaylistSchema>
    export type AddVideoToPlaylistDto = z.infer<typeof addVideoToPlaylistSchema>
    export type RemoveVideoFromPlaylistDto = z.infer<typeof removeVideoFromPlaylistSchema>
    export type GetUserPlaylistsDto = z.infer<typeof getUserPlaylistsSchema>
}


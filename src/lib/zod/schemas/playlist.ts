// src/lib/zod/schemas/playlist.ts
import { z } from "zod"
import { idSchema, paginationSchema } from "./base"

const nameSchema = z.string().min(1).max(255)
const descriptionSchema = z.string().max(1000).optional()

export const createPlaylistSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
})

export const updatePlaylistSchema = z.object({
    id: idSchema.shape.id,
    name: nameSchema.optional(),
    description: descriptionSchema,
})

export const getPlaylistByIdSchema = z.object({
    id: idSchema.shape.id,
})

export const deletePlaylistSchema = z.object({
    id: idSchema.shape.id,
})

export const addVideoToPlaylistSchema = z.object({
    playlistId: idSchema.shape.id,
    videoId: idSchema.shape.id,
})

export const removeVideoFromPlaylistSchema = z.object({
    playlistId: idSchema.shape.id,
    videoId: idSchema.shape.id,
})

export const getUserPlaylistsSchema = z.object({
    ...paginationSchema.shape,
})

// src/lib/zod/dto/playlist.ts
import { z } from "zod"
import * as playlistSchema from "../schemas/playlist"

export namespace PlaylistDto {
    export type CreatePlaylistDto = z.infer<typeof playlistSchema.createPlaylistSchema>
    export type UpdatePlaylistDto = z.infer<typeof playlistSchema.updatePlaylistSchema>
    export type GetPlaylistByIdDto = z.infer<typeof playlistSchema.getPlaylistByIdSchema>
    export type DeletePlaylistDto = z.infer<typeof playlistSchema.deletePlaylistSchema>
    export type AddVideoToPlaylistDto = z.infer<typeof playlistSchema.addVideoToPlaylistSchema>
    export type RemoveVideoFromPlaylistDto = z.infer<typeof playlistSchema.removeVideoFromPlaylistSchema>
    export type GetUserPlaylistsDto = z.infer<typeof playlistSchema.getUserPlaylistsSchema>
}

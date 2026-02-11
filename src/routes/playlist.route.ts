// src/routes/playlist.route.ts
import { Router } from "express"
import Container from "@/containerj"
import * as playlistSchema from "@/lib/zod/schemas/playlist"
import * as baseSchema from "@/lib/zod/schemas/base"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate"
import { asyncHandler } from "@/lib/asyncHandler"

const playlistController = Container.getPlaylistController()
const router = Router()

// POST - Create a new playlist
router.post(
    "/",
    auth(),
    validate({ body: playlistSchema.createPlaylistSchema }),
    asyncHandler(playlistController.createPlaylist.bind(playlistController))
)

// POST - Add video to playlist
router.post(
    "/video/add",
    auth(),
    validate({ body: playlistSchema.addVideoToPlaylistSchema }),
    asyncHandler(playlistController.addVideoToPlaylist.bind(playlistController))
)

// GET - Get playlist by ID
router.get(
    "/:id",
    validate({ params: baseSchema.idSchema }),
    asyncHandler(playlistController.getPlaylistById.bind(playlistController))
)

// GET - Get user playlists
router.get(
    "/",
    auth(),
    validate({ query: baseSchema.paginationSchema }),
    asyncHandler(playlistController.getUserPlaylists.bind(playlistController))
)

// PUT - Update playlist
router.put(
    "/:id",
    auth(),
    validate({ params: baseSchema.idSchema, body: playlistSchema.updatePlaylistSchema }),
    asyncHandler(playlistController.updatePlaylist.bind(playlistController))
)

// DELETE - Remove video from playlist
router.delete(
    "/video/remove",
    auth(),
    validate({ body: playlistSchema.removeVideoFromPlaylistSchema }),
    asyncHandler(playlistController.removeVideoFromPlaylist.bind(playlistController))
)

// DELETE - Delete playlist
router.delete(
    "/:id",
    auth(),
    validate({ params: baseSchema.idSchema }),
    asyncHandler(playlistController.deletePlaylist.bind(playlistController))
)

export default router

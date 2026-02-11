import { Request, Response } from "express"
import PlaylistService from "@/services/playlist.service"
import { HttpError } from "@/lib/errors/http.error"

export default class PlaylistController {
    constructor(private playlistService: PlaylistService) {}

    async createPlaylist(req: Request, res: Response) {
        const { id } = req.user
        const playlist = await this.playlistService.createPlaylist(req.validatedBody, id)
        res.status(201).json({
            message: "Playlist created successfully",
            data: playlist
        })
    }

    async getPlaylistById(req: Request, res: Response) {
        const playlist = await this.playlistService.getPlaylistById(req.validatedParams)
        res.status(200).json({
            message: "Playlist fetched successfully",
            data: playlist
        })
    }

    async getUserPlaylists(req: Request, res: Response) {
        const { id } = req.user
        const pagination = req.validatedQuery
        const playlists = await this.playlistService.getUserPlaylists(id, pagination)
        res.status(200).json({
            data: playlists,
            count: playlists.length
        })
    }

    async updatePlaylist(req: Request, res: Response) {
        const { id } = req.user
        const playlist = await this.playlistService.updatePlaylist(
            { ...req.validatedParams, ...req.validatedBody },
            id
        )
        res.status(200).json({
            message: "Playlist updated successfully",
            data: playlist
        })
    }

    async deletePlaylist(req: Request, res: Response) {
        const { id } = req.user
        const playlist = await this.playlistService.deletePlaylist(req.validatedParams, id)
        res.status(200).json({
            message: "Playlist deleted successfully",
            data: playlist
        })
    }

    async addVideoToPlaylist(req: Request, res: Response) {
        const { id } = req.user
        const playlist = await this.playlistService.addVideoToPlaylist(
            { ...req.validatedParams, ...req.validatedBody },
            id
        )
        res.status(200).json({
            message: "Video added to playlist successfully",
            data: playlist
        })
    }

    async removeVideoFromPlaylist(req: Request, res: Response) {
        const { id } = req.user
        const playlist = await this.playlistService.removeVideoFromPlaylist(
            { ...req.validatedParams, ...req.validatedBody },
            id
        )
        res.status(200).json({
            message: "Video removed from playlist successfully",
            data: playlist
        })
    }
}
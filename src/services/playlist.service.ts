import { PrismaClient } from "@prisma/client"
import { PlaylistDto } from "@/lib/zod.schemas/playlist.schema"
import { BaseDto } from "@/lib/zod.schemas/base.schema"
import { HttpError } from "@/lib/errors/http.error"
import { UserDto } from "@/lib/zod.schemas/user.schema"

export default class PlaylistService {
    constructor(private prisma: PrismaClient) {}

    async createPlaylist(
        { name, description }: PlaylistDto.CreatePlaylistDto,
        userId: string
    ) {
        return await this.prisma.playlist.create({
            data: {
                name,
                description,
                user: {
                    connect: { id: userId }
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { videos: true }
                }
            }
        })
    }

    async getPlaylistById( id : BaseDto.idDto ) {
        const playlist = await this.prisma.playlist.findUnique({
            where: { id },
            include: {
                videos: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        duration: true,
                        views: true,
                        authorId: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                _count: {
                    select: { videos: true }
                }
            }
        })

        if (!playlist) {
            throw new HttpError(404, "Playlist not found")
        }

        return playlist
    }

    async getUserPlaylists(userId: string, pagination: { take?: number; skip?: number }) {
        return await this.prisma.playlist.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                description: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { videos: true }
                }
            },
            orderBy: { createdAt: "desc" },
            ...pagination
        })
    }

    async updatePlaylist(
        { id, name, description }: PlaylistDto.UpdatePlaylistDto
    ) {
        return await this.prisma.playlist.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description })
            },
            select: {
                id: true,
                name: true,
                description: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { videos: true }
                }
            }
        })
    }

    async deletePlaylist(  UserDto.AuthUserDto ) {
         return await this.prisma.playlist.delete({
            where: { id },
            select: {
                id: true,
                name: true
            }
        })
    }

    async addVideoToPlaylist(
        { playlistId, videoId }: PlaylistDto.AddVideoToPlaylistDto,
        userId: string
    ) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } })

        if (!playlist) {
            throw new HttpError(404, "Playlist not found")
        }

        if (playlist.userId !== userId) {
            throw new HttpError(403, "You can only edit your own playlists")
        }

        const video = await this.prisma.video.findUnique({ where: { id: videoId } })

        if (!video) {
            throw new HttpError(404, "Video not found")
        }

        // Check if video is already in playlist
        const exists = await this.prisma.playlist.findFirst({
            where: {
                id: playlistId,
                videos: {
                    some: { id: videoId }
                }
            }
        })

        if (exists) {
            throw new HttpError(409, "Video is already in this playlist")
        }

        return await this.prisma.playlist.update({
            where: { id: playlistId },
            data: {
                videos: {
                    connect: { id: videoId }
                }
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: { videos: true }
                }
            }
        })
    }

    async removeVideoFromPlaylist(
        { playlistId, videoId }: PlaylistDto.RemoveVideoFromPlaylistDto,
        userId: string
    ) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } })

        if (!playlist) {
            throw new HttpError(404, "Playlist not found")
        }

        if (playlist.userId !== userId) {
            throw new HttpError(403, "You can only edit your own playlists")
        }

        return await this.prisma.playlist.update({
            where: { id: playlistId },
            data: {
                videos: {
                    disconnect: { id: videoId }
                }
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: { videos: true }
                }
            }
        })
    }
}
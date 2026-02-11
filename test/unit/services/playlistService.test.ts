// test/unit/services/playlistService.test.ts
import { prismaMock, mockPlaylist, createMockPlaylist } from '@test/mocks'
import PlaylistService from '@/services/playlist.service'
import { HttpError } from '@/lib/errors/http.error'

describe('PlaylistService', () => {
  let playlistService: PlaylistService

  beforeEach(() => {
    playlistService = new PlaylistService(prismaMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createPlaylist', () => {
    it('should create a new playlist', async () => {
      const mockData = createMockPlaylist({ id: 'playlist-1', userId: 'user-1' })

      prismaMock.playlist.create.mockResolvedValue(mockData as any)

      const result = await playlistService.createPlaylist(
        { name: 'My Playlist', description: 'Test' },
        'user-1'
      )

      expect(result).toEqual(mockData)
      expect(prismaMock.playlist.create).toHaveBeenCalledWith({
        data: {
          name: 'My Playlist',
          description: 'Test',
          user: {
            connect: { id: 'user-1' }
          }
        },
        select: expect.any(Object)
      })
    })

    it('should create playlist without description', async () => {
      const mockData = createMockPlaylist({ id: 'p1', userId: 'user-1' })

      prismaMock.playlist.create.mockResolvedValue(mockData as any)

      const result = await playlistService.createPlaylist(
        { name: 'My Playlist' },
        'user-1'
      )

      expect(result.name).toBe('My Playlist')
    })
  })

  describe('getPlaylistById', () => {
    it('should get playlist by id', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)

      const result = await playlistService.getPlaylistById({ id: 'playlist-1' })

      expect(result).toEqual(mockPlaylist)
      expect(prismaMock.playlist.findUnique).toHaveBeenCalledWith({
        where: { id: 'playlist-1' },
        include: expect.any(Object)
      })
    })

    it('should throw 404 when playlist not found', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(null)

      await expect(playlistService.getPlaylistById({ id: 'nonexistent' })).rejects.toThrow(
        expect.objectContaining({
          status: 404,
          message: 'Playlist not found'
        })
      )
    })
  })

  describe('getUserPlaylists', () => {
    it('should get all playlists of user', async () => {
      const mockPlaylists = [
        createMockPlaylist({ id: 'p1', userId: 'user-1' }),
        createMockPlaylist({ id: 'p2', userId: 'user-1' })
      ]

      prismaMock.playlist.findMany.mockResolvedValue(mockPlaylists as any)

      const result = await playlistService.getUserPlaylists('user-1', { take: 10, skip: 0 })

      expect(result).toHaveLength(2)
      expect(result[0].userId).toBe('user-1')
      expect(prismaMock.playlist.findMany).toHaveBeenCalled()
    })

    it('should return empty array when user has no playlists', async () => {
      prismaMock.playlist.findMany.mockResolvedValue([])

      const result = await playlistService.getUserPlaylists('user-1', {})

      expect(result).toEqual([])
    })
  })

  describe('updatePlaylist', () => {
    it('should update playlist name and description', async () => {
      const existingPlaylist = mockPlaylist
      const updatedPlaylist = { ...mockPlaylist, name: 'Updated Name' }

      prismaMock.playlist.findUnique.mockResolvedValue(existingPlaylist as any)
      prismaMock.playlist.update.mockResolvedValue(updatedPlaylist as any)

      const result = await playlistService.updatePlaylist(
        { id: 'playlist-1', name: 'Updated Name', description: 'Updated Desc' },
        'user-1'
      )

      expect(result.name).toBe('Updated Name')
      expect(prismaMock.playlist.update).toHaveBeenCalled()
    })

    it('should throw 404 when playlist not found', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(null)

      await expect(
        playlistService.updatePlaylist({ id: 'nonexistent', name: 'Name' }, 'user-1')
      ).rejects.toThrow('Playlist not found')
    })

    it('should throw 403 when user is not owner', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)

      await expect(
        playlistService.updatePlaylist({ id: 'playlist-1', name: 'Name' }, 'user-2')
      ).rejects.toThrow(
        expect.objectContaining({
          status: 403,
          message: 'You can only edit your own playlists'
        })
      )
    })
  })

  describe('deletePlaylist', () => {
    it('should delete playlist', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)
      prismaMock.playlist.delete.mockResolvedValue(mockPlaylist as any)

      const result = await playlistService.deletePlaylist({ id: 'playlist-1' }, 'user-1')

      expect(result.id).toBe('playlist-1')
      expect(prismaMock.playlist.delete).toHaveBeenCalledWith({
        where: { id: 'playlist-1' },
        select: expect.any(Object)
      })
    })

    it('should throw 403 when user is not owner', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)

      await expect(playlistService.deletePlaylist({ id: 'playlist-1' }, 'user-2')).rejects.toThrow(
        expect.objectContaining({
          status: 403
        })
      )
    })
  })

  describe('addVideoToPlaylist', () => {
    it('should add video to playlist', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)
      prismaMock.video.findUnique.mockResolvedValue({ id: 'video-1' } as any)
      prismaMock.playlist.findFirst.mockResolvedValue(null)
      prismaMock.playlist.update.mockResolvedValue({ ...mockPlaylist } as any)

      const result = await playlistService.addVideoToPlaylist(
        { playlistId: 'playlist-1', videoId: 'video-1' },
        'user-1'
      )

      expect(result.id).toBe('playlist-1')
      expect(prismaMock.playlist.update).toHaveBeenCalled()
    })

    it('should throw 404 when playlist not found', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(null)

      await expect(
        playlistService.addVideoToPlaylist({ playlistId: 'nonexistent', videoId: 'video-1' }, 'user-1')
      ).rejects.toThrow('Playlist not found')
    })

    it('should throw 404 when video not found', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)
      prismaMock.video.findUnique.mockResolvedValue(null)

      await expect(
        playlistService.addVideoToPlaylist({ playlistId: 'playlist-1', videoId: 'nonexistent' }, 'user-1')
      ).rejects.toThrow('Video not found')
    })

    it('should throw 409 when video already in playlist', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)
      prismaMock.video.findUnique.mockResolvedValue({ id: 'video-1' } as any)
      prismaMock.playlist.findFirst.mockResolvedValue(mockPlaylist as any)

      await expect(
        playlistService.addVideoToPlaylist({ playlistId: 'playlist-1', videoId: 'video-1' }, 'user-1')
      ).rejects.toThrow(
        expect.objectContaining({
          status: 409,
          message: 'Video is already in this playlist'
        })
      )
    })

    it('should throw 403 when user is not owner', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)

      await expect(
        playlistService.addVideoToPlaylist({ playlistId: 'playlist-1', videoId: 'video-1' }, 'user-2')
      ).rejects.toThrow(
        expect.objectContaining({
          status: 403
        })
      )
    })
  })

  describe('removeVideoFromPlaylist', () => {
    it('should remove video from playlist', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)
      prismaMock.playlist.update.mockResolvedValue({ ...mockPlaylist } as any)

      const result = await playlistService.removeVideoFromPlaylist(
        { playlistId: 'playlist-1', videoId: 'video-1' },
        'user-1'
      )

      expect(result.id).toBe('playlist-1')
      expect(prismaMock.playlist.update).toHaveBeenCalledWith({
        where: { id: 'playlist-1' },
        data: {
          videos: {
            disconnect: { id: 'video-1' }
          }
        },
        select: expect.any(Object)
      })
    })

    it('should throw 403 when user is not owner', async () => {
      prismaMock.playlist.findUnique.mockResolvedValue(mockPlaylist as any)

      await expect(
        playlistService.removeVideoFromPlaylist(
          { playlistId: 'playlist-1', videoId: 'video-1' },
          'user-2'
        )
      ).rejects.toThrow(
        expect.objectContaining({
          status: 403
        })
      )
    })
  })
})

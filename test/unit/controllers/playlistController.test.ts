// test/unit/controllers/playlistController.test.ts
import { Request, Response } from 'express'
import PlaylistController from '@/controllers/playlist.controller'
import PlaylistService from '@/services/playlist.service'
import { HttpError } from '@/lib/errors/http.error'
import { createMockPlaylist } from '@test/mocks'

// Mock the PlaylistService
jest.mock('@/services/playlist.service')

describe('PlaylistController', () => {
  let playlistController: PlaylistController
  let mockService: jest.Mocked<PlaylistService>
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    mockService = new PlaylistService(null as any) as jest.Mocked<PlaylistService>
    playlistController = new PlaylistController(mockService)

    req = {
      user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
      validatedBody: {},
      validatedParams: {},
      validatedQuery: { skip: 0, take: 10 }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createPlaylist', () => {
    it('should create playlist and return 201 status', async () => {
      const mockData = createMockPlaylist({ userId: 'user-1' }) as any
      req.validatedBody = { name: 'My Playlist', description: 'Test' }
      mockService.createPlaylist.mockResolvedValue(mockData)

      await playlistController.createPlaylist(req as Request, res as Response)

      expect(mockService.createPlaylist).toHaveBeenCalledWith(req.validatedBody, 'user-1')
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Playlist created successfully',
          data: mockData
        })
      )
    })

    it('should throw error when service throws', async () => {
      const error = new HttpError(400, 'Invalid input')
      req.validatedBody = { name: 'My Playlist' }
      mockService.createPlaylist.mockRejectedValue(error)

      await expect(playlistController.createPlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })
  })

  describe('getPlaylistById', () => {
    it('should return playlist with 200 status', async () => {
      req.validatedParams = { id: 'playlist-1' }
      const mockData = createMockPlaylist({ id: 'playlist-1' })
      mockService.getPlaylistById.mockResolvedValue(mockData as any)

      await playlistController.getPlaylistById(req as Request, res as Response)

      expect(mockService.getPlaylistById).toHaveBeenCalledWith({ id: 'playlist-1' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Playlist fetched successfully',
          data: mockData
        })
      )
    })

    it('should throw 404 error when playlist not found', async () => {
      req.validatedParams = { id: 'nonexistent' }
      const error = new HttpError(404, 'Playlist not found')
      mockService.getPlaylistById.mockRejectedValue(error)

      await expect(playlistController.getPlaylistById(req as Request, res as Response)).rejects.toThrow(error)
    })
  })

  describe('getUserPlaylists', () => {
    it('should return user playlists with 200 status', async () => {
      const mockPlaylists = [
        createMockPlaylist({ id: 'p1', userId: 'user-1' }),
        createMockPlaylist({ id: 'p2', userId: 'user-1' })
      ] as any

      mockService.getUserPlaylists.mockResolvedValue(mockPlaylists)

      await playlistController.getUserPlaylists(req as Request, res as Response)

      expect(mockService.getUserPlaylists).toHaveBeenCalledWith('user-1', expect.any(Object))
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalled()
    })

    it('should return empty array when user has no playlists', async () => {
      mockService.getUserPlaylists.mockResolvedValue([])

      await playlistController.getUserPlaylists(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalled()
    })
  })

  describe('updatePlaylist', () => {
    it('should update playlist and return 200 status', async () => {
      const updatedPlaylist = createMockPlaylist({ id: 'playlist-1', userId: 'user-1', name: 'Updated' }) as any
      req.validatedParams = { id: 'playlist-1' }
      req.validatedBody = { name: 'Updated Name', description: 'Updated Desc' }
      mockService.updatePlaylist.mockResolvedValue(updatedPlaylist)

      await playlistController.updatePlaylist(req as Request, res as Response)

      expect(mockService.updatePlaylist).toHaveBeenCalledWith(
        { id: 'playlist-1', name: 'Updated Name', description: 'Updated Desc' },
        'user-1'
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalled()
    })

    it('should throw 403 error when user not owner', async () => {
      req.validatedParams = { id: 'playlist-1' }
      req.validatedBody = { name: 'Updated Name' }
      const error = new HttpError(403, 'You can only edit your own playlists')
      mockService.updatePlaylist.mockRejectedValue(error)

      await expect(playlistController.updatePlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })

    it('should throw 404 error when playlist not found', async () => {
      req.validatedParams = { id: 'nonexistent' }
      req.validatedBody = { name: 'Updated Name' }
      const error = new HttpError(404, 'Playlist not found')
      mockService.updatePlaylist.mockRejectedValue(error)

      await expect(playlistController.updatePlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })
  })

  describe('deletePlaylist', () => {
    it('should delete playlist and return 200 status', async () => {
      req.validatedParams = { id: 'playlist-1' }
      const deletedPlaylist = createMockPlaylist({ id: 'playlist-1', userId: 'user-1' })
      mockService.deletePlaylist.mockResolvedValue(deletedPlaylist)

      await playlistController.deletePlaylist(req as Request, res as Response)

      expect(mockService.deletePlaylist).toHaveBeenCalledWith({ id: 'playlist-1' }, 'user-1')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalled()
    })

    it('should throw 403 error when user not owner', async () => {
      req.validatedParams = { id: 'playlist-1' }
      const error = new HttpError(403, 'You can only delete your own playlists')
      mockService.deletePlaylist.mockRejectedValue(error)

      await expect(playlistController.deletePlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })

    it('should throw 404 error when playlist not found', async () => {
      req.validatedParams = { id: 'nonexistent' }
      const error = new HttpError(404, 'Playlist not found')
      mockService.deletePlaylist.mockRejectedValue(error)

      await expect(playlistController.deletePlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })
  })

  describe('addVideoToPlaylist', () => {
    it('should add video to playlist and return 200 status', async () => {
      req.validatedParams = { playlistId: 'playlist-1' }
      req.validatedBody = { videoId: 'video-1' }
      const updatedPlaylist = createMockPlaylist({ id: 'playlist-1', userId: 'user-1' }) as any
      mockService.addVideoToPlaylist.mockResolvedValue(updatedPlaylist)

      await playlistController.addVideoToPlaylist(req as Request, res as Response)

      expect(mockService.addVideoToPlaylist).toHaveBeenCalledWith(
        { playlistId: 'playlist-1', videoId: 'video-1' },
        'user-1'
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalled()
    })

    it('should throw 409 error when video already in playlist', async () => {
      req.validatedParams = { playlistId: 'playlist-1' }
      req.validatedBody = { videoId: 'video-1' }
      const error = new HttpError(409, 'Video is already in this playlist')
      mockService.addVideoToPlaylist.mockRejectedValue(error)

      await expect(playlistController.addVideoToPlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })

    it('should throw 404 error when video not found', async () => {
      req.validatedParams = { playlistId: 'playlist-1' }
      req.validatedBody = { videoId: 'nonexistent' }
      const error = new HttpError(404, 'Video not found')
      mockService.addVideoToPlaylist.mockRejectedValue(error)

      await expect(playlistController.addVideoToPlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })

    it('should throw 403 error when user not owner', async () => {
      req.user = { id: 'user-2' } as any
      req.validatedParams = { playlistId: 'playlist-1' }
      req.validatedBody = { videoId: 'video-1' }
      const error = new HttpError(403, 'You can only edit your own playlists')
      mockService.addVideoToPlaylist.mockRejectedValue(error)

      await expect(playlistController.addVideoToPlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })
  })

  describe('removeVideoFromPlaylist', () => {
    it('should remove video from playlist and return 200 status', async () => {
      req.validatedParams = { playlistId: 'playlist-1' }
      req.validatedBody = { videoId: 'video-1' }
      const updatedPlaylist = createMockPlaylist({ id: 'playlist-1', userId: 'user-1' }) as any
      mockService.removeVideoFromPlaylist.mockResolvedValue(updatedPlaylist)

      await playlistController.removeVideoFromPlaylist(req as Request, res as Response)

      expect(mockService.removeVideoFromPlaylist).toHaveBeenCalledWith(
        { playlistId: 'playlist-1', videoId: 'video-1' },
        'user-1'
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalled()
    })

    it('should throw 403 error when user not owner', async () => {
      req.user = { id: 'user-2' } as any
      req.validatedParams = { playlistId: 'playlist-1' }
      req.validatedBody = { videoId: 'video-1' }
      const error = new HttpError(403, 'You can only edit your own playlists')
      mockService.removeVideoFromPlaylist.mockRejectedValue(error)

      await expect(playlistController.removeVideoFromPlaylist(req as Request, res as Response)).rejects.toThrow(error)
    })
  })
})

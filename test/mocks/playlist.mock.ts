// test/mocks/playlist.mock.ts
import { Playlist } from '@prisma/client'

export const mockPlaylist = {
  id: 'playlist-1',
  name: 'My Playlist',
  description: null,
  userId: 'user-1',
  createdAt: new Date('2026-02-09'),
  updatedAt: new Date('2026-02-09'),
  _count: {
    videos: 0
  }
}

export const createMockPlaylist = (overrides?: Partial<typeof mockPlaylist>) => ({
  ...mockPlaylist,
  ...overrides
})

export const mockPlaylistWithVideos = {
  ...mockPlaylist,
  videos: [
    {
      id: 'video-1',
      title: 'Video 1',
      description: 'Test video',
      url: 'http://example.com/video1',
      thumbnail: 'http://example.com/thumb1.jpg',
      duration: 300,
      views: 100,
      published: true,
      authorId: 'user-1',
      createdAt: new Date('2026-02-09'),
      updatedAt: new Date('2026-02-09'),
      deleted: false,
      deletedAt: null,
      commentCount: 0,
      publishedAt: new Date('2026-02-09'),
      rating: null,
      categoryId: 'category-1'
    }
  ],
  _count: {
    videos: 1
  }
}

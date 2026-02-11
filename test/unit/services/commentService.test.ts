import { prismaMock, mockComment, createMockComment } from '@test/mocks';
import CommentService from '@/services/comment.service';

describe('CommentService', () => {
  let commentService: CommentService;

  beforeEach(() => {
    commentService = new CommentService(prismaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const newComment = createMockComment({ content: 'New Comment' });
      prismaMock.comment.create.mockResolvedValue(newComment);

      const result = await commentService.createComment({
        content: 'New Comment',
        videoId: 'video-123',
        userId: '123',
      });

      expect(result).toEqual(newComment);
      expect(prismaMock.comment.create).toHaveBeenCalled();
    });

    it('should throw error when comment creation fails', async () => {
      prismaMock.comment.create.mockRejectedValue(new Error('Database error'));

      await expect(
        commentService.createComment({
          content: 'New Comment',
          videoId: 'video-123',
          userId: '123',
        })
      ).rejects.toThrow('Database error');
    });
  });

  describe('getCommentsFromVideo', () => {
    it('should return comments from a video', async () => {
      const comments = [mockComment];
      prismaMock.comment.findMany.mockResolvedValue(comments);

      const result = await commentService.getCommentsFromVideo({
        videoId: 'video-123',
        skip: 1,
        take: 10,
        orderBy: { createdAt: 'desc', upvotes: "asc" },
      });

      expect(result).toEqual(comments);
      expect(prismaMock.comment.findMany).toHaveBeenCalled();
    });

    it('should return empty array if no comments', async () => {
      prismaMock.comment.findMany.mockResolvedValue([]);

      const result = await commentService.getCommentsFromVideo({
        videoId: 'video-123',
        skip: 1,
        take: 10,
        orderBy: { createdAt: 'desc', upvotes: "asc" },
      });

      expect(result).toEqual([]);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      prismaMock.comment.delete.mockResolvedValue(mockComment);

      const result = await commentService.deleteComment(mockComment.id);

      expect(result).toEqual(mockComment);
      expect(prismaMock.comment.delete).toHaveBeenCalled();
    });

    it('should throw error if comment not found', async () => {
      prismaMock.comment.delete.mockRejectedValue(new Error('Comment not found'));

      await expect(
        commentService.deleteComment('invalid-id')
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const updatedComment = createMockComment({ content: 'Updated Content' });
      prismaMock.comment.update.mockResolvedValue(updatedComment);

      const result = await commentService.updateComment({
        id: mockComment.id,
        content: 'Updated Content',
      });

      expect(result).toEqual(updatedComment);
    });
  });
});

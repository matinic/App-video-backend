import prisma from '@/lib/client';
import UserService from '@/services/user.service';
import UserController from '@/controllers/user.controller';
import NotificationService from '@/services/notification.service';
import NotificationController from '@/controllers/notification.controller';
import VideoService from '@/services/video.service';
import VideoController from '@/controllers/video.controller';
import CommentService from '@/services/comment.service';
import CommentController from '@/controllers/comment.controller';
import MessageService from './services/message.service';
import MessageController from './controllers/message.controller';
import PlaylistService from '@/services/playlist.service';
import PlaylistController from '@/controllers/playlist.controller';

export class Container {
  private static instances = new Map<string, any>();

  static getPrisma() {
    return prisma;
  }

  static getUserService(): UserService {
    if (!this.instances.has('UserService')) {
      this.instances.set('UserService', new UserService(this.getPrisma()));
    }
    return this.instances.get('UserService');
  }

  static getNotificationService(): NotificationService {
    if (!this.instances.has('NotificationService')) {
      this.instances.set('NotificationService', new NotificationService(this.getPrisma()));
    }
    return this.instances.get('NotificationService');
  }

  static getVideoService(): VideoService {
    if (!this.instances.has('VideoService')) {
      this.instances.set('VideoService', new VideoService(this.getPrisma()));
    }
    return this.instances.get('VideoService');
  }

  static getCommentService(): CommentService {
    if (!this.instances.has('CommentService')) {
      this.instances.set('CommentService', new CommentService(this.getPrisma()));
    }
    return this.instances.get('CommentService');
  }

  static getPlaylistService(): PlaylistService {
    if (!this.instances.has('PlaylistService')) {
      this.instances.set('PlaylistService', new PlaylistService(this.getPrisma()));
    }
    return this.instances.get('PlaylistService');
  }


  static getUserController(): UserController {
    if (!this.instances.has('UserController')) {
      this.instances.set('UserController', new UserController(this.getUserService(), this.getNotificationService()));
    }
    return this.instances.get('UserController');
  }

  static getNotificationController(): NotificationController {
    if (!this.instances.has('NotificationController')) {
      this.instances.set('NotificationController', new NotificationController(this.getNotificationService()));
    }
    return this.instances.get('NotificationController');
  }

  static getVideoController(): VideoController {
    if (!this.instances.has('VideoController')) {
      this.instances.set('VideoController', new VideoController(this.getUserService(), this.getVideoService(), this.getNotificationService()));
    }
    return this.instances.get('VideoController');
  }

  static getCommentController(): CommentController {
    if (!this.instances.has('CommentController')) {
      this.instances.set('CommentController', new CommentController(this.getCommentService()));
    }
    return this.instances.get('CommentController');
  }
    static getMessageService(): MessageService {
    if (!this.instances.has('MessageService')) {
      this.instances.set('MessageService', new MessageService(this.getPrisma()));
    }
    return this.instances.get('MessageService');
  }

  static getMessageController(): MessageController {
    if (!this.instances.has('MessageController')) {
      this.instances.set('MessageController', new MessageController(this.getMessageService()));
    }
    return this.instances.get('MessageController');
  }

  static getPlaylistController(): PlaylistController {
    if (!this.instances.has('PlaylistController')) {
      this.instances.set('PlaylistController', new PlaylistController(this.getPlaylistService()));
    }
    return this.instances.get('PlaylistController');
  }

  
}

export default Container;
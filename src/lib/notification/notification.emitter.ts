// src/notifications/notification.emitter.ts

import { EventEmitter } from 'events';
import { DICTIONARY } from '../dictionay';
import { z } from "zod"

// ─── Typed Event Map ──────────────────────────────────────────────────────────

export interface NotificationEvents {
  userCreated:  {
    userName: string,
    userId: string,
    userEmail: string,
    userImageUrl: string | null 
  };
  videoUploaded: {
    videoId: string,
    videoTitle: string,
    videoThumbnail: string,
    authorUserId: string,
    authorUserName: string
  };
  newFollowerUser: {
    newFollowerUserName: string,
    newFollowerUserId: string, 
    newFollowerUserImageUrl: string,
    recipientUserId: string
  };
  // 'custom':         import('./notification.schema').CreateNotificationDto;
  // Internal lifecycle events
  notificationCreated: {
    recipientUserId: string[],
    notificationId: string,
    notificationTitle: string,
    notificationMetadata?: unknown
  };
  notificationsRead: {
    notificationId: string[],
    userId: string 
  };
  notificationError:{
    error: Error;
    context?: unknown
  };
}

// ─── Typed Emitter ────────────────────────────────────────────────────────────

class TypedNotificationEmitter extends EventEmitter {
  emit<K extends keyof NotificationEvents>(
    event: K,
    payload: NotificationEvents[K],
  ): boolean {
    return super.emit(event as string, payload);
  }

  on<K extends keyof NotificationEvents>(
    event: K,
    listener: (payload: NotificationEvents[K]) => void | Promise<void>): this {
      //Preparar un listener nuevo aca con el argumento payload ya parseado

    return super.on(event as string, listener);
  }
  once<K extends keyof NotificationEvents>(
    event: K,
    listener: (payload: NotificationEvents[K]) => void | Promise<void>,
  ): this {
    return super.once(event as string, listener);
  }

  off<K extends keyof NotificationEvents>(
    event: K,
    listener: (payload: NotificationEvents[K]) => void | Promise<void>,
  ): this {
    return super.off(event as string, listener);
  }
}

// Singleton — one emitter for the entire application
export const NotificationEmitter = new TypedNotificationEmitter();
export type NotificationEmitter = typeof NotificationEmitter

// Prevent memory leaks in large apps
NotificationEmitter.setMaxListeners(50);

import { Notification, NotificationDb } from "./type"

const referenceMap = {
  "NEW-VIDEO": "video",
  "NEW-MESSAGE": "message",
  "NEW-COMMENT": "comment",
  "NEW-COMMENT-RESPONSE": "comment",
  "NEW-SUBSCRIPTION": "userEmmiter"
} as const;

type NotificationTypeKey = keyof typeof referenceMap

export default function notificationsFormat(notificationsFound: NotificationDb): Notification[] {
  return notificationsFound.map( ({ notification }) => {
    const { type } = notification.notificationType;

    if (!(type in referenceMap)) {
      throw new Error(`Unsupported Notification Type: ${type}`);
    }

    const key = referenceMap[type as NotificationTypeKey];

    return {
      message: `${notification.userEmmiter.name} ${notification.notificationType.message}`,
      userEmmiter: notification.userEmmiter,
      type: type as NotificationTypeKey,
      referenceData: {
        [key]: notification[key]
      }
    } as Notification;
  });
}

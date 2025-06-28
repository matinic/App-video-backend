import notificationService from "../../services/notification.service";
import notificationType from "./data.json"

export type NotificationDb = Awaited<ReturnType<typeof notificationService.getNotification>>;

type NotificationDbInnerType = Awaited<ReturnType<typeof notificationService.getNotification>>[number];
        
export type Notification = {
    message: string,
    userEmmiter: NotificationDbInnerType["userEmmiter"]
    type: keyof typeof notificationType
    referenceData: {
        video?: NotificationDbInnerType["video"]
        comment?: NotificationDbInnerType["comment"]
        user?: NotificationDbInnerType["userEmmiter"]
        directMessage?: NotificationDbInnerType["message"]
    }
}
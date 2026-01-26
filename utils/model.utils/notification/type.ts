import notificationService from "@/services/notification.service";

//Notification related types 
//Notification service

export type NotificationDb = Awaited<ReturnType<typeof notificationService.getNotification>> ;

export type NotificationInner = NotificationDb[number]["notification"]

export type Notification = {
    message: string,
    userEmmiter: NotificationInner["userEmmiter"]
    type: string
    referenceData: {
        video?: NotificationInner["video"]
        comment?: NotificationInner["comment"]
        user?: NotificationInner["userEmmiter"]
        directMessage?: NotificationInner["message"]
    }
}
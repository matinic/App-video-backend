import NotificationService from "@/services/notification.service";

//Notification related types 
//Notification service

export type NotificationDb = Awaited<ReturnType<InstanceType<typeof NotificationService>["getNotification"]>> ;

export type NotificationInner = NotificationDb[number]["notification"]

export type Notification = {
    message: string,
    userEmmiter: NotificationInner["userEmmiter"]
    type: string
    referenceData: { }
}
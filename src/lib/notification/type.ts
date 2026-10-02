import NotificationService from "@/services/notification.service";

//Notification related types 
//Notification service

export type NotificationDb = Awaited<ReturnType<InstanceType<typeof NotificationService>["getNotification"]>> ;

export type NotificationInner = NonNullable<NotificationDb>

export type Notification = NotificationInner
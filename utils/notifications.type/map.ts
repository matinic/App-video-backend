import notificationType from "./data.json"
import { NotificationDb, Notification } from "./dto"

export default function notificationsFormat(notificationsFound:NotificationDb){
    return notificationsFound.map((notification):Notification => {
            const base = {
                message: `${notification.userEmmiter.name} ${notification.notificationType.message}`,
                userEmmiter: notification.userEmmiter,
            };
            switch (notification.notificationType.type){
                case notificationType["NEW-VIDEO"].type:
                    return {
                        ...base, 
                        type: "NEW-VIDEO",
                        referenceData: {
                            video: notification.video 
                        }
                    }
                case notificationType["NEW-MESSAGE"].type:
                    return {
                        ...base,
                        type:"NEW-MESSAGE",
                        referenceData: {
                            directMessage: notification.message
                        }
                    }
                case notificationType["NEW-SUBSCRIPTION"].type:
                    return {
                        ...base,
                        type: "NEW-SUBSCRIPTION",
                        referenceData: {
                            comment: notification.comment
                        }
                    }
                case notificationType["RESPONSE-COMMENT"].type:
                    return{
                        ...base,
                        type: "RESPONSE-COMMENT",
                        referenceData:{
                            user: notification.userEmmiter
                        }                           
                    }
                default: 
                    throw new Error("Unsoported Notification Format")
            }
        })
} 
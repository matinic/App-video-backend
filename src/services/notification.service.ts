import { NotificationDto }   from "@/lib/zod.schemas/notification.schema"
import { PrismaClient, User, UserOnNotification } from "@prisma/client"
import { NotificationEmitter as emiter } from "@/lib/notification/notification.emitter"
import { JsonObject } from "@prisma/client/runtime/client"
import { BaseDto } from "@/lib/zod.schemas/base.schema"


const SSEResponses = new Map<string,Response>()

export default class NotificationService {
    constructor(private prisma: PrismaClient ) {}

    async registerNotificationsListeners(){

        emiter.on("userCreated", ( { userEmail, userId, userImageUrl, userName } )=>{
            this.createNotification({
                notificationMetadata: { userEmail, userImageUrl },
                recipientsUserId: [ userId ],
                notificationTitle: `Bienvenido ${ userName }, gracias por registrarse`,
            })
}) 
        emiter.on("notificationCreated", ( args )=>{
            //this.sendNotification(args)
        })
        emiter.on("newFollowerUser",({ newFollowerUserId, newFollowerUserImageUrl, newFollowerUserName, recipientUserId} )=>{
            this.createNotification({
                notificationMetadata: { newFollowerUserId, newFollowerUserImageUrl },
                notificationTitle: `${newFollowerUserName} se ha sumado como seguidor tuyo`,
                recipientsUserId: [recipientUserId]
            })
        })
        emiter.on("videoUploaded",async ({ authorUserId, videoId, videoThumbnail, videoTitle, authorUserName })=>{
            const followers = await this.prisma.user.findFirst({
                where: {id: authorUserId},
                select: {
                    followers: {
                        select:{
                            followerId: true
                        }
                    },
                }
            })
            if(!followers) throw new Error("Something wrong happend while retrieving followers");
            this.createNotification({
                notificationMetadata: { videoId, videoThumbnail },
                notificationTitle: `${authorUserName} ha subido un nuevo video: ${videoTitle}`,
                recipientsUserId:  followers.followers.map( follower => follower.followerId )
            })
        })
        emiter.on("notificationError",({error,context})=>{
            this.retrySendNotification({error,context})
        })
        emiter.on("notificationsRead", ({notificationId,userId})=>{
            this.markNotificationsAsRead({notificationId, userId})
        })

    }
    async retrySendNotification({}){

    }
    async markNotificationsAsRead( { notificationId, userId }: NotificationDto.MarkNotificationsAsReadDto){
        return await this.prisma.userOnNotification.updateMany({
            where:{
                notificationId: {
                    in: notificationId.map( id => id )
                },
                recipientUserId: userId
            },
            data:{
                read: true
            }
        })
        
    }
    async sendNotification( {recipientsUserId, notificationId}: NotificationDto.SendNotificationsDto){ 
        //manejo de logica de envio a usuario con conexiones sse
        //Sin SSE
        //Se relaciona a los usurios que solo tengan la opcion isActiveNotification: true;
        await this.prisma.$transaction(async (tx) => {
            const usersWithActiveNotifications = await tx.user.findMany({
                where:{
                    id:{
                        in:  recipientsUserId.map( id => id )
                    },
                    isNotificationActive: true
                },
                select:{
                    id: true
                }
            })
            await tx.userOnNotification.createMany({
                data: usersWithActiveNotifications.map( ({id}) => ({    
                    notificationId,
                    recipientUserId: id
                }))
            })
        })
          
    }
    async createNotification( args: NotificationDto.CreateNotificationDto  ){
     
        function assert(notificationArg: unknown): asserts notificationArg is JsonObject {
            if(typeof notificationArg !== "object") throw Error("Notification Error: invalid metadata Json format")
        } 
        assert(args.notificationMetadata)
        const newNotification = await this.prisma.notification.create({
            data:{
                metadata: args.notificationMetadata,
                title: args.notificationTitle,
            },
            select:{
                id: true,
                title: true,
                metadata: true,
            }
        })
        
        if(!newNotification) new Error("Something wrong happend, notification was not created")
        emiter.emit("notificationCreated", {
           notificationId: newNotification.id,
           notificationTitle: newNotification.title,
           recipientUserId: args.recipientsUserId,
           notificationMetadata: newNotification.metadata
        })
    }
    async getNotification({ notificationId }: NotificationDto.GetNotificationDto){
        return await this.prisma.notification.findFirst({
            where:{
                id: notificationId,
            }
        })
    }
    async getAllNotifications({ userId, ...pagination }: NotificationDto.GetAllNotificationsDto){
        const notificationFound = await this.prisma.userOnNotification.findMany({
            where:{
                recipientUserId: userId
            },
            ...pagination
        })
        const metadataFound = notificationFound
    }
    //---------------------------------------
    async addNewSSEConnection({ response, userId }: { response: Response, userId: string }){
        SSEResponses.set(userId, response)
    }
    async deleteSSEConnection(){

    }
    async getSSEConnection(){
        
    }
}

import { NotificationDto }   from "@/lib/zod.schemas/notification.schema"
import { PrismaClient } from "@prisma/client"
import { NotificationEmitter as emiter } from "@/lib/notification/notification.emitter"
import { JsonObject } from "@prisma/client/runtime/client"


const SSEResponses = new Map<string,Response>()

export default class NotificationService {
    private listenersRegistered = false

    constructor(private prisma: PrismaClient ) {}

    async registerNotificationsListeners(){
        if (this.listenersRegistered) return
        this.listenersRegistered = true

        emiter.on("userCreated", (payload) => this.handleEvent(payload, () =>
            this.createNotification({
                notificationMetadata: { userEmail: payload.userEmail, userImageUrl: payload.userImageUrl },
                recipientsUserId: [payload.userId],
                notificationTitle: `Bienvenido ${payload.userName}, gracias por registrarse`,
            })
        ))
        emiter.on("notificationCreated", (payload) => this.handleEvent(payload, () =>
            this.sendNotification(payload)
        ))
        emiter.on("newFollowerUser", (payload) => this.handleEvent(payload, () =>
            this.createNotification({
                notificationMetadata: {
                    newFollowerUserId: payload.newFollowerUserId,
                    newFollowerUserImageUrl: payload.newFollowerUserImageUrl,
                },
                notificationTitle: `${payload.newFollowerUserName} se ha sumado como seguidor tuyo`,
                recipientsUserId: [payload.recipientUserId],
            })
        ))
        emiter.on("videoUploaded", (payload) => this.handleEvent(payload, async () => {
            const author = await this.prisma.user.findUnique({
                where: { id: payload.authorUserId },
                select: { followers: { select: { followerId: true } } },
            })
            if (!author) throw new Error("Could not find the video author")

            await this.createNotification({
                notificationMetadata: { videoId: payload.videoId, videoThumbnail: payload.videoThumbnail },
                notificationTitle: `${payload.authorUserName} ha subido un nuevo video: ${payload.videoTitle}`,
                recipientsUserId: author.followers.map(({ followerId }) => followerId),
            })
        }))
        emiter.on("notificationError", ({ error, context }) => {
            console.error("Notification event failed", { error, context })
        })
        emiter.on("notificationsRead", (payload) => this.handleEvent(payload, () =>
            this.markNotificationsAsRead(payload)
        ))
    }

    private async handleEvent(context: unknown, action: () => Promise<unknown>){
        try {
            await action()
        } catch (error) {
            emiter.emit("notificationError", {
                error: error instanceof Error ? error : new Error(String(error)),
                context,
            })
        }
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
        if (recipientsUserId.length === 0) return

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
            if(typeof notificationArg !== "object" || notificationArg === null || Array.isArray(notificationArg)) {
                throw Error("Notification Error: invalid metadata Json format")
            }
        } 
        const notificationMetadata = args.notificationMetadata ?? {}
        assert(notificationMetadata)
        const newNotification = await this.prisma.notification.create({
            data:{
                metadata: notificationMetadata,
                title: args.notificationTitle,
            },
            select:{
                id: true,
                title: true,
                metadata: true,
            }
        })
        
        emiter.emit("notificationCreated", {
           notificationId: newNotification.id,
           notificationTitle: newNotification.title,
              recipientsUserId: args.recipientsUserId,
           notificationMetadata: newNotification.metadata
        })
    }
    async getNotification({ notificationId, userId }: NotificationDto.GetNotificationDto){
        return await this.prisma.notification.findFirst({
            where:{
                id: notificationId,
                recipient: {
                    some: { recipientUserId: userId },
                },
            }
        })
    }
    async getAllNotifications({ userId, skip, take }: NotificationDto.GetAllNotificationsDto){
        return await this.prisma.userOnNotification.findMany({
            where:{
                recipientUserId: userId
            },
            include: { notification: true },
            orderBy: { createdAt: "desc" },
            skip: skip ?? 0,
            take: take ?? 20,
        })
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

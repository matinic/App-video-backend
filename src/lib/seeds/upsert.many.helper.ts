import { PrismaClient } from "@prisma/client";
import notificationPairs from "../notification/data"

export default async (prisma:PrismaClient)=>{
    return await prisma.$transaction(
        Object.values(notificationPairs).map( ({ id, message }) => {
                return prisma.notificationType.upsert({
                    where: { type: id },
                    update: {},
                    create: {
                        type: id,
                        message,
                    },
                } 
            )
        })
    )
}



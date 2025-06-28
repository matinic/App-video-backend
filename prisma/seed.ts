import { PrismaClient } from "../generated/prisma";
import notificationType from "../utils/notifications.type/data.json"
const prisma = new PrismaClient()
async function main() {
  const newVideo = await prisma.notificationType.upsert({
    where: { type: notificationType["NEW-VIDEO"].type },
    update: {},
    create: {
      type:notificationType["NEW-VIDEO"].type,
      message:notificationType["NEW-VIDEO"].message,
    },
  })
  const newComment = await prisma.notificationType.upsert({
    where: { type: notificationType["NEW-COMMENT"].type },
    update: {},
    create: {
      type:notificationType["NEW-COMMENT"].type,
      message:notificationType["NEW-COMMENT"].message,
    },
  })
  const newSubscription = await prisma.notificationType.upsert({
    where: { type: notificationType["NEW-SUBSCRIPTION"].type },
    update: {},
    create: {
      type:notificationType["NEW-SUBSCRIPTION"].type,
      message:notificationType["NEW-SUBSCRIPTION"].message,
    },
  })
  const newMessage = await prisma.notificationType.upsert({
    where: { type: notificationType["NEW-MESSAGE"].type },
    update: {},
    create: {
      type:notificationType["NEW-MESSAGE"].type,
      message:notificationType["NEW-MESSAGE"].message,
    },
  })
  console.log({ newVideo, newComment, newSubscription, newMessage })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
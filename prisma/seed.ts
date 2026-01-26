import { PrismaClient } from "../generated/prisma";
import notificationTypeUpsertMany from "../utils/notification/notifications.type/upsert.many"

const prisma = new PrismaClient()

async function main() {
    const dataUpsert = await notificationTypeUpsertMany(prisma)
    console.log(dataUpsert)
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
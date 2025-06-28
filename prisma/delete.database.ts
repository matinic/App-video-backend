import 'dotenv/config'
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

async function deleteMain(){
    await prisma.notificationType.deleteMany()
}

deleteMain()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
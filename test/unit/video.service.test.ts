import { PrismaClient } from "@prisma/client"
import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import VideoService from "../../src/services/video.service"

describe("VideoService.updateUserVideoStatus", () => {
  const prisma = {
    userVideoStatus: {
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as PrismaClient
  const service = new VideoService(prisma)
  const status = { userId: "user-1", videoId: "video-1", isLike: true }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("creates the status when no relation exists", async () => {
    const created = { ...status }
    jest.mocked(prisma.userVideoStatus.findFirst).mockResolvedValue(null)
    jest.mocked(prisma.userVideoStatus.create).mockResolvedValue(created as never)

    await expect(service.updateUserVideoStatus(status)).resolves.toEqual(created)
    expect(prisma.userVideoStatus.create).toHaveBeenCalledWith({ data: status })
  })

  it("removes the relation when the same status is selected again", async () => {
    jest.mocked(prisma.userVideoStatus.findFirst).mockResolvedValue(status as never)
    jest.mocked(prisma.userVideoStatus.delete).mockResolvedValue(status as never)

    await expect(service.updateUserVideoStatus(status)).resolves.toBeNull()
    expect(prisma.userVideoStatus.delete).toHaveBeenCalledWith({
      where: { videoId_userId: { userId: status.userId, videoId: status.videoId } },
    })
  })

  it("updates the relation when the selected status changes", async () => {
    const previousStatus = { ...status, isLike: false }
    jest.mocked(prisma.userVideoStatus.findFirst).mockResolvedValue(previousStatus as never)
    jest.mocked(prisma.userVideoStatus.update).mockResolvedValue(status as never)

    await expect(service.updateUserVideoStatus(status)).resolves.toEqual(status)
    expect(prisma.userVideoStatus.update).toHaveBeenCalledWith({
      where: { videoId_userId: { userId: status.userId, videoId: status.videoId } },
      data: { isLike: true },
    })
  })
})
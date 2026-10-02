import express, { Router } from "express"
import { describe, expect, it, jest } from "@jest/globals"
import request from "supertest"
import { z } from "zod"
import VideoController from "../../src/controllers/video.controller"
import errorMiddleware from "../../src/lib/middlewares/error.middleware"
import validate from "../../src/lib/middlewares/validate"
import { NotificationEmitter } from "../../src/lib/notification/notification.emitter"
import VideoService from "../../src/services/video.service"

const videoId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"

function createTestApp(videoService: { getVideoById: (id: string) => Promise<unknown> }) {
  const controller = new VideoController(
    videoService as unknown as VideoService,
    NotificationEmitter,
  )
  const router = Router()
  router.get(
    "/:id",
    validate({ params: z.object({ id: z.uuid() }) }),
    controller.getVideoById.bind(controller),
  )

  const app = express()
  app.use("/videos", router)
  app.use(errorMiddleware)
  return app
}

describe("Video HTTP integration", () => {
  it("validates the URL and passes the parsed ID to the controller service", async () => {
    const video = { id: videoId, title: "Test video" }
    const getVideoById = jest.fn(async (_id: string): Promise<unknown> => video)
    const videoService = { getVideoById }

    const response = await request(createTestApp(videoService)).get(`/videos/${videoId}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(video)
    expect(videoService.getVideoById).toHaveBeenCalledWith(videoId)
  })

  it("rejects invalid IDs without calling the service", async () => {
    const getVideoById = jest.fn(async (_id: string): Promise<unknown> => null)
    const videoService = { getVideoById }

    const response = await request(createTestApp(videoService)).get("/videos/not-an-id")

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Validation failed")
    expect(getVideoById).not.toHaveBeenCalled()
  })
})
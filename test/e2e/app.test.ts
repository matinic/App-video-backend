import { describe, expect, it } from "@jest/globals"
import request from "supertest"
import app from "../../src/app"

describe("API end-to-end", () => {
  it("serves the health endpoint", async () => {
    const response = await request(app).get("/health")

    expect(response.status).toBe(200)
    expect(response.body.status).toBe("OK")
    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false)
  })

  it("returns 404 for unknown paths", async () => {
    const response = await request(app).get("/does-not-exist")

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: "Route not found" })
  })
})
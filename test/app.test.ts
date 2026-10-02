import assert from "node:assert/strict"
import { test } from "node:test"
import app from "../src/app"

test("GET /health returns the API health status", async (context) => {
  const server = app.listen(0)
  context.after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  })

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve)
    server.once("error", reject)
  })

  const address = server.address()
  assert.ok(address && typeof address !== "string")

  const response = await fetch(`http://127.0.0.1:${address.port}/health`)
  const body = await response.json() as { status: string; timestamp: string }

  assert.equal(response.status, 200)
  assert.equal(body.status, "OK")
  assert.ok(Number.isFinite(Date.parse(body.timestamp)))
})
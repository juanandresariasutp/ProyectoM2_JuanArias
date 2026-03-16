import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import app from "../src/app.js"

vi.mock("../src/services/authors.service.js")

import {
  getAllAuthors,
  getAuthorById,
  getAuthorByEmail,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from "../src/services/authors.service.js"

const mockAuthor = {
  id: 1,
  name: "Juan Arias",
  email: "juan@test.com",
  bio: "Developer",
  created_at: "2026-01-01T00:00:00.000Z"
}

// ─── GET /authors ────────────────────────────────────────────────────────────

describe("GET /authors", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 200 with the list of authors", async () => {
    getAllAuthors.mockResolvedValue([mockAuthor])

    const res = await request(app).get("/authors")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([mockAuthor])
  })

  it("returns 500 when the service throws", async () => {
    getAllAuthors.mockRejectedValue(new Error("DB error"))

    const res = await request(app).get("/authors")

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty("error")
  })
})

// ─── GET /authors/:id ────────────────────────────────────────────────────────

describe("GET /authors/:id", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 200 with the author", async () => {
    getAuthorById.mockResolvedValue(mockAuthor)

    const res = await request(app).get("/authors/1")

    expect(res.status).toBe(200)
    expect(res.body).toEqual(mockAuthor)
  })

  it("returns 404 if author does not exist", async () => {
    getAuthorById.mockResolvedValue(undefined)

    const res = await request(app).get("/authors/999")

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty("error", "Author not found")
  })
})

// ─── POST /authors ───────────────────────────────────────────────────────────

describe("POST /authors", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 201 with the created author", async () => {
    getAuthorByEmail.mockResolvedValue(undefined)
    createAuthor.mockResolvedValue(mockAuthor)

    const res = await request(app)
      .post("/authors")
      .send({ name: "Juan Arias", email: "juan@test.com", bio: "Developer" })

    expect(res.status).toBe(201)
    expect(res.body).toEqual(mockAuthor)
  })

  it("returns 400 if name is missing", async () => {
    const res = await request(app)
      .post("/authors")
      .send({ email: "juan@test.com" })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "name and email are required")
  })

  it("returns 400 if email is missing", async () => {
    const res = await request(app)
      .post("/authors")
      .send({ name: "Juan Arias" })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "name and email are required")
  })

  it("returns 400 if name is an empty string", async () => {
    const res = await request(app)
      .post("/authors")
      .send({ name: "   ", email: "juan@test.com" })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "name and email are required")
  })

  it("returns 400 if email already exists", async () => {
    getAuthorByEmail.mockResolvedValue(mockAuthor)

    const res = await request(app)
      .post("/authors")
      .send({ name: "Juan Arias", email: "juan@test.com" })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "email must be unique")
  })
})

// ─── PUT /authors/:id ────────────────────────────────────────────────────────

describe("PUT /authors/:id", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 200 updating only bio (partial update)", async () => {
    const updated = { ...mockAuthor, bio: "Super trainer" }
    getAuthorById.mockResolvedValue(mockAuthor)
    updateAuthor.mockResolvedValue(updated)

    const res = await request(app)
      .put("/authors/1")
      .send({ bio: "Super trainer" })

    expect(res.status).toBe(200)
    expect(res.body.bio).toBe("Super trainer")
  })

  it("returns 200 updating all fields", async () => {
    const updated = { ...mockAuthor, name: "New Name", email: "new@test.com" }
    getAuthorById.mockResolvedValue(mockAuthor)
    getAuthorByEmail.mockResolvedValue(undefined)
    updateAuthor.mockResolvedValue(updated)

    const res = await request(app)
      .put("/authors/1")
      .send({ name: "New Name", email: "new@test.com" })

    expect(res.status).toBe(200)
    expect(res.body).toEqual(updated)
  })

  it("returns 400 if no fields are sent", async () => {
    const res = await request(app)
      .put("/authors/1")
      .send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "at least one field is required")
  })

  it("returns 400 if name is an empty string", async () => {
    getAuthorById.mockResolvedValue(mockAuthor)

    const res = await request(app)
      .put("/authors/1")
      .send({ name: "   " })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "name cannot be empty")
  })

  it("returns 400 if email is an empty string", async () => {
    getAuthorById.mockResolvedValue(mockAuthor)

    const res = await request(app)
      .put("/authors/1")
      .send({ email: "   " })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "email cannot be empty")
  })

  it("returns 400 if email is already used by another author", async () => {
    const otherAuthor = { ...mockAuthor, id: 2 }
    getAuthorById.mockResolvedValue(mockAuthor)
    getAuthorByEmail.mockResolvedValue(otherAuthor)

    const res = await request(app)
      .put("/authors/1")
      .send({ email: "other@test.com" })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "email must be unique")
  })

  it("returns 404 if author does not exist", async () => {
    getAuthorById.mockResolvedValue(undefined)

    const res = await request(app)
      .put("/authors/999")
      .send({ name: "New Name" })

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty("error", "Author not found")
  })
})

// ─── DELETE /authors/:id ─────────────────────────────────────────────────────

describe("DELETE /authors/:id", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 204 when author is deleted", async () => {
    deleteAuthor.mockResolvedValue(true)

    const res = await request(app).delete("/authors/1")

    expect(res.status).toBe(204)
  })

  it("returns 404 if author does not exist", async () => {
    deleteAuthor.mockResolvedValue(false)

    const res = await request(app).delete("/authors/999")

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty("error", "Author not found")
  })
})

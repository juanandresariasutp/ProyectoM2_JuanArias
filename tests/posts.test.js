import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import app from "../src/app.js"

vi.mock("../src/services/posts.service.js")

import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor
} from "../src/services/posts.service.js"

const mockPost = {
  id: 1,
  title: "Mi primer post",
  content: "Contenido del post",
  author_id: 1,
  published: false,
  created_at: "2026-01-01T00:00:00.000Z"
}

// ─── GET /posts ──────────────────────────────────────────────────────────────

describe("GET /posts", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 200 with the list of posts", async () => {
    getAllPosts.mockResolvedValue([mockPost])

    const res = await request(app).get("/posts")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([mockPost])
  })

  it("returns 500 when the service throws", async () => {
    getAllPosts.mockRejectedValue(new Error("DB error"))

    const res = await request(app).get("/posts")

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty("error")
  })
})

// ─── GET /posts/:id ──────────────────────────────────────────────────────────

describe("GET /posts/:id", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 200 with the post", async () => {
    getPostById.mockResolvedValue(mockPost)

    const res = await request(app).get("/posts/1")

    expect(res.status).toBe(200)
    expect(res.body).toEqual(mockPost)
  })

  it("returns 404 if post does not exist", async () => {
    getPostById.mockResolvedValue(undefined)

    const res = await request(app).get("/posts/999")

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty("error", "Post not found")
  })
})

// ─── GET /posts/author/:authorId ─────────────────────────────────────────────

describe("GET /posts/author/:authorId", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 200 with posts of the author", async () => {
    getPostsByAuthor.mockResolvedValue([mockPost])

    const res = await request(app).get("/posts/author/1")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([mockPost])
  })

  it("returns 200 with empty array if author has no posts", async () => {
    getPostsByAuthor.mockResolvedValue([])

    const res = await request(app).get("/posts/author/99")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

// ─── POST /posts ─────────────────────────────────────────────────────────────

describe("POST /posts", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 201 with the created post", async () => {
    createPost.mockResolvedValue(mockPost)

    const res = await request(app)
      .post("/posts")
      .send({ title: "Mi primer post", content: "Contenido del post", author_id: 1 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual(mockPost)
  })

  it("returns 400 if title is missing", async () => {
    const res = await request(app)
      .post("/posts")
      .send({ content: "Contenido", author_id: 1 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })

  it("returns 400 if content is missing", async () => {
    const res = await request(app)
      .post("/posts")
      .send({ title: "Título", author_id: 1 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })

  it("returns 400 if author_id is missing", async () => {
    const res = await request(app)
      .post("/posts")
      .send({ title: "Título", content: "Contenido" })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })

  it("returns 400 if title is an empty string", async () => {
    const res = await request(app)
      .post("/posts")
      .send({ title: "   ", content: "Contenido", author_id: 1 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })

  it("returns 400 if author_id is not a positive integer", async () => {
    const res = await request(app)
      .post("/posts")
      .send({ title: "Título", content: "Contenido", author_id: -1 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })

  it("returns 400 if author_id is zero", async () => {
    const res = await request(app)
      .post("/posts")
      .send({ title: "Título", content: "Contenido", author_id: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })
})

// ─── PUT /posts/:id ──────────────────────────────────────────────────────────

describe("PUT /posts/:id", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 200 with the updated post", async () => {
    const updated = { ...mockPost, title: "Título actualizado" }
    updatePost.mockResolvedValue(updated)

    const res = await request(app)
      .put("/posts/1")
      .send({ title: "Título actualizado", content: "Contenido", author_id: 1 })

    expect(res.status).toBe(200)
    expect(res.body).toEqual(updated)
  })

  it("returns 400 if title is missing", async () => {
    const res = await request(app)
      .put("/posts/1")
      .send({ content: "Contenido", author_id: 1 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })

  it("returns 400 if content is empty string", async () => {
    const res = await request(app)
      .put("/posts/1")
      .send({ title: "Título", content: "   ", author_id: 1 })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })

  it("returns 400 if author_id is not a positive integer", async () => {
    const res = await request(app)
      .put("/posts/1")
      .send({ title: "Título", content: "Contenido", author_id: "abc" })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error", "title, content and author_id are required")
  })

  it("returns 404 if post does not exist", async () => {
    updatePost.mockResolvedValue(undefined)

    const res = await request(app)
      .put("/posts/999")
      .send({ title: "Título", content: "Contenido", author_id: 1 })

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty("error", "Post not found")
  })
})

// ─── DELETE /posts/:id ───────────────────────────────────────────────────────

describe("DELETE /posts/:id", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns 204 when post is deleted", async () => {
    deletePost.mockResolvedValue(true)

    const res = await request(app).delete("/posts/1")

    expect(res.status).toBe(204)
  })

  it("returns 404 if post does not exist", async () => {
    deletePost.mockResolvedValue(false)

    const res = await request(app).delete("/posts/999")

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty("error", "Post not found")
  })
})

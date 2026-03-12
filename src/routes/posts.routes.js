import express from "express"

import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor
} from "../services/posts.service.js"

const router = express.Router()

// GET /posts
router.get("/", async (req, res) => {
  const posts = await getAllPosts()
  res.json(posts)
})

// GET /posts/:id
router.get("/:id", async (req, res) => {
  const post = await getPostById(req.params.id)

  if (!post) {
    return res.status(404).json({ error: "Post not found" })
  }

  res.json(post)
})

// GET /posts/author/:authorId
router.get("/author/:authorId", async (req, res) => {
  const posts = await getPostsByAuthor(req.params.authorId)
  res.json(posts)
})

// POST /posts
router.post("/", async (req, res) => {
  const { title, content, author_id } = req.body

  if (!title || !content || !author_id) {
    return res.status(400).json({
      error: "title, content and author_id are required"
    })
  }

  const post = await createPost(title, content, author_id)

  res.status(201).json(post)
})

// PUT /posts/:id
router.put("/:id", async (req, res) => {
  const { title, content } = req.body

  const post = await updatePost(
    req.params.id,
    title,
    content
  )

  if (!post) {
    return res.status(404).json({ error: "Post not found" })
  }

  res.json(post)
})

// DELETE /posts/:id
router.delete("/:id", async (req, res) => {
  await deletePost(req.params.id)
  res.status(204).send()
})

export default router
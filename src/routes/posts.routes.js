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
const isNonEmptyString = (value) => (
  typeof value === "string" && value.trim() !== ""
)

const parsePositiveInteger = (value) => {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null
  }

  return parsedValue
}

const asyncHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

// GET /posts
router.get("/", asyncHandler(async (req, res) => {
  const posts = await getAllPosts()
  res.status(200).json(posts)
}))

// GET /posts/:id
router.get("/:id", asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.id)

  if (!post) {
    return res.status(404).json({ error: "Post not found" })
  }

  res.status(200).json(post)
}))

// GET /posts/author/:authorId
router.get("/author/:authorId", asyncHandler(async (req, res) => {
  const posts = await getPostsByAuthor(req.params.authorId)
  res.status(200).json(posts)
}))

// POST /posts
router.post("/", asyncHandler(async (req, res) => {
  const { title, content, author_id } = req.body
  const parsedAuthorId = parsePositiveInteger(author_id)

  if (
    !isNonEmptyString(title) ||
    !isNonEmptyString(content) ||
    parsedAuthorId === null
  ) {
    return res.status(400).json({
      error: "title, content and author_id are required"
    })
  }

  const post = await createPost(
    title.trim(),
    content.trim(),
    parsedAuthorId
  )

  res.status(201).json(post)
}))

// PUT /posts/:id
router.put("/:id", asyncHandler(async (req, res) => {
  const { title, content, author_id } = req.body
  const parsedAuthorId = parsePositiveInteger(author_id)

  if (
    !isNonEmptyString(title) ||
    !isNonEmptyString(content) ||
    parsedAuthorId === null
  ) {
    return res.status(400).json({
      error: "title, content and author_id are required"
    })
  }

  const post = await updatePost(
    req.params.id,
    title.trim(),
    content.trim(),
    parsedAuthorId
  )

  if (!post) {
    return res.status(404).json({ error: "Post not found" })
  }

  res.status(200).json(post)
}))

// DELETE /posts/:id
router.delete("/:id", asyncHandler(async (req, res) => {
  const deleted = await deletePost(req.params.id)

  if (!deleted) {
    return res.status(404).json({ error: "Post not found" })
  }

  res.status(204).send()
}))

export default router
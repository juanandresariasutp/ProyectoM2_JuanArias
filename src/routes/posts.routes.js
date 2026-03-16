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

// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts()
    res.status(200).json(posts)
  } catch (error) {
    next(error)
  }
})

// GET /posts/:id
router.get("/:id", async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
})

// GET /posts/author/:authorId
router.get("/author/:authorId", async (req, res, next) => {
  try {
    const posts = await getPostsByAuthor(req.params.authorId)
    res.status(200).json(posts)
  } catch (error) {
    next(error)
  }
})

// POST /posts
router.post("/", async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
})

// PUT /posts/:id
router.put("/:id", async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
})

// DELETE /posts/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deletePost(req.params.id)

    if (!deleted) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
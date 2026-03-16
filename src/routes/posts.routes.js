import express from "express"

import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor
} from "../services/posts.service.js"
import {
  badRequestError,
  notFoundError
} from "../middleware/errors.js"
import {
  isNonEmptyString,
  parsePositiveInteger
} from "../middleware/validators.js"

const router = express.Router()

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
      return next(notFoundError("Post not found"))
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
      return next(
        badRequestError("title, content and author_id are required")
      )
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
      return next(
        badRequestError("title, content and author_id are required")
      )
    }

    const post = await updatePost(
      req.params.id,
      title.trim(),
      content.trim(),
      parsedAuthorId
    )

    if (!post) {
      return next(notFoundError("Post not found"))
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
      return next(notFoundError("Post not found"))
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
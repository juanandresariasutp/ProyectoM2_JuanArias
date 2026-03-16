import express from "express"

import {
  getAllAuthors,
  getAuthorById,
  getAuthorByEmail,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from "../services/authors.service.js"
import {
  badRequestError,
  notFoundError
} from "../middleware/errors.js"

const router = express.Router()
const isNonEmptyString = (value) => (
  typeof value === "string" && value.trim() !== ""
)

// GET /authors
router.get("/", async (req, res, next) => {
  try {
    const authors = await getAllAuthors()
    res.status(200).json(authors)
  } catch (error) {
    next(error)
  }
})

// GET /authors/:id
router.get("/:id", async (req, res, next) => {
  try {
    const author = await getAuthorById(req.params.id)

    if (!author) {
      return next(notFoundError("Author not found"))
    }

    res.status(200).json(author)
  } catch (error) {
    next(error)
  }
})

// POST /authors
router.post("/", async (req, res, next) => {
  try {
    const { name, email, bio } = req.body

    if (!isNonEmptyString(name) || !isNonEmptyString(email)) {
      return next(
        badRequestError("name and email are required")
      )
    }

    const existingAuthor = await getAuthorByEmail(email.trim())

    if (existingAuthor) {
      return next(
        badRequestError("email must be unique")
      )
    }

    const author = await createAuthor(name.trim(), email.trim(), bio)

    res.status(201).json(author)
  } catch (error) {
    next(error)
  }
})

// PUT /authors/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { name, email, bio } = req.body

    if (
      name === undefined &&
      email === undefined &&
      bio === undefined
    ) {
      return next(
        badRequestError("at least one field is required")
      )
    }

    const currentAuthor = await getAuthorById(req.params.id)

    if (!currentAuthor) {
      return next(notFoundError("Author not found"))
    }

    if (name !== undefined && !isNonEmptyString(name)) {
      return next(
        badRequestError("name cannot be empty")
      )
    }

    if (email !== undefined && !isNonEmptyString(email)) {
      return next(
        badRequestError("email cannot be empty")
      )
    }

    if (email !== undefined) {
      const existingAuthor = await getAuthorByEmail(email.trim())

      if (
        existingAuthor &&
        Number(existingAuthor.id) !== Number(req.params.id)
      ) {
        return next(
          badRequestError("email must be unique")
        )
      }
    }

    const author = await updateAuthor(
      req.params.id,
      name !== undefined ? name.trim() : currentAuthor.name,
      email !== undefined ? email.trim() : currentAuthor.email,
      bio !== undefined ? bio : currentAuthor.bio
    )

    res.status(200).json(author)
  } catch (error) {
    next(error)
  }
})

// DELETE /authors/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteAuthor(req.params.id)

    if (!deleted) {
      return next(notFoundError("Author not found"))
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
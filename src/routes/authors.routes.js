import express from "express"

import {
  getAllAuthors,
  getAuthorById,
  getAuthorByEmail,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from "../services/authors.service.js"

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
      return res.status(404).json({ error: "Author not found" })
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
      return res.status(400).json({
        error: "name and email are required"
      })
    }

    const existingAuthor = await getAuthorByEmail(email.trim())

    if (existingAuthor) {
      return res.status(400).json({
        error: "email must be unique"
      })
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

    if (!isNonEmptyString(name) || !isNonEmptyString(email)) {
      return res.status(400).json({
        error: "name and email are required"
      })
    }

    const existingAuthor = await getAuthorByEmail(email.trim())

    if (
      existingAuthor &&
      Number(existingAuthor.id) !== Number(req.params.id)
    ) {
      return res.status(400).json({
        error: "email must be unique"
      })
    }

    const author = await updateAuthor(
      req.params.id,
      name.trim(),
      email.trim(),
      bio
    )

    if (!author) {
      return res.status(404).json({ error: "Author not found" })
    }

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
      return res.status(404).json({ error: "Author not found" })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
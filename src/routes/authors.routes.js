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

const asyncHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res)
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "email must be unique" })
    }

    res.status(500).json({ error: "Internal server error" })
  }
}

// GET /authors
router.get("/", asyncHandler(async (req, res) => {
  const authors = await getAllAuthors()
  res.status(200).json(authors)
}))

// GET /authors/:id
router.get("/:id", asyncHandler(async (req, res) => {
  const author = await getAuthorById(req.params.id)

  if (!author) {
    return res.status(404).json({ error: "Author not found" })
  }

  res.status(200).json(author)
}))

// POST /authors
router.post("/", asyncHandler(async (req, res) => {
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
}))

// PUT /authors/:id
router.put("/:id", asyncHandler(async (req, res) => {
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
}))

// DELETE /authors/:id
router.delete("/:id", asyncHandler(async (req, res) => {
  const deleted = await deleteAuthor(req.params.id)

  if (!deleted) {
    return res.status(404).json({ error: "Author not found" })
  }

  res.status(204).send()
}))

export default router
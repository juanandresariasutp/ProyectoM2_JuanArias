import express from "express"

import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from "../services/authors.service.js"

const router = express.Router()

// GET /authors
router.get("/", async (req, res) => {
  const authors = await getAllAuthors()
  res.json(authors)
})

// GET /authors/:id
router.get("/:id", async (req, res) => {
  const author = await getAuthorById(req.params.id)

  if (!author) {
    return res.status(404).json({ error: "Author not found" })
  }

  res.json(author)
})

// POST /authors
router.post("/", async (req, res) => {
  const { name, email, bio } = req.body

  if (!name || !email) {
    return res.status(400).json({
      error: "name and email are required"
    })
  }

  const author = await createAuthor(name, email, bio)

  res.status(201).json(author)
})

// PUT /authors/:id
router.put("/:id", async (req, res) => {
  const { name, email, bio } = req.body

  const author = await updateAuthor(
    req.params.id,
    name,
    email,
    bio
  )

  if (!author) {
    return res.status(404).json({ error: "Author not found" })
  }

  res.json(author)
})

// DELETE /authors/:id
router.delete("/:id", async (req, res) => {
  await deleteAuthor(req.params.id)

  res.status(204).send()
})

export default router
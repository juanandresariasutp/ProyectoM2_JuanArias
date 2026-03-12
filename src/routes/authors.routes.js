import express from "express"
import { authors } from "../data/data.js"

const router = express.Router()

// GET /authors
router.get("/", (req, res) => {
  res.json(authors)
})

// GET /authors/:id
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id)

  const author = authors.find(a => a.id === id)

  if (!author) {
    return res.status(404).json({ error: "Author not found" })
  }

  res.json(author)
})

// POST /authors
router.post("/", (req, res) => {
  const { name, email, bio } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" })
  }

  const newAuthor = {
    id: authors.length + 1,
    name,
    email,
    bio
  }

  authors.push(newAuthor)

  res.status(201).json(newAuthor)
})

// PUT /authors/:id
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id)

  const author = authors.find(a => a.id === id)

  if (!author) {
    return res.status(404).json({ error: "Author not found" })
  }

  const { name, email, bio } = req.body

  if (name) author.name = name
  if (email) author.email = email
  if (bio) author.bio = bio

  res.json(author)
})

// DELETE /authors/:id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id)

  const index = authors.findIndex(a => a.id === id)

  if (index === -1) {
    return res.status(404).json({ error: "Author not found" })
  }

  authors.splice(index, 1)

  res.status(204).send()
})

export default router
import express from "express"
import { posts, authors } from "../data/data.js"

const router = express.Router()

// GET /posts
router.get("/", (req, res) => {
  res.json(posts)
})

// GET /posts/:id
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id)

  const post = posts.find(p => p.id === id)

  if (!post) {
    return res.status(404).json({ error: "Post not found" })
  }

  res.json(post)
})

// GET /posts/author/:authorId
router.get("/author/:authorId", (req, res) => {
  const authorId = parseInt(req.params.authorId)

  const author = authors.find(a => a.id === authorId)

  if (!author) {
    return res.status(404).json({ error: "Author not found" })
  }

  const authorPosts = posts.filter(p => p.author_id === authorId)

  res.json({
    author,
    posts: authorPosts
  })
})

// POST /posts
router.post("/", (req, res) => {
  const { title, content, author_id, published } = req.body

  if (!title || !content || !author_id) {
    return res.status(400).json({
      error: "title, content and author_id are required"
    })
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    author_id,
    published: published ?? false
  }

  posts.push(newPost)

  res.status(201).json(newPost)
})

// PUT /posts/:id
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id)

  const post = posts.find(p => p.id === id)

  if (!post) {
    return res.status(404).json({ error: "Post not found" })
  }

  const { title, content, published } = req.body

  if (title) post.title = title
  if (content) post.content = content
  if (published !== undefined) post.published = published

  res.json(post)
})

// DELETE /posts/:id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id)

  const index = posts.findIndex(p => p.id === id)

  if (index === -1) {
    return res.status(404).json({ error: "Post not found" })
  }

  posts.splice(index, 1)

  res.status(204).send()
})

export default router
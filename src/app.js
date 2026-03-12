import express from "express"
import authorsRoutes from "./routes/authors.routes.js"
import postsRoutes from "./routes/posts.routes.js"

const app = express()

app.use(express.json())

app.use("/authors", authorsRoutes)
app.use("/posts", postsRoutes)

export default app
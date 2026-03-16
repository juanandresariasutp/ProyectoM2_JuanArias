import express from "express"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import authorsRoutes from "./routes/authors.routes.js"
import postsRoutes from "./routes/posts.routes.js"
import errorHandler from "./middleware/errorHandler.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const swaggerDocument = YAML.load(join(__dirname, "docs/openapi.yaml"))

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
	res.status(200).json({
		message: "API running"
	})
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/authors", authorsRoutes)
app.use("/posts", postsRoutes)

app.use(errorHandler)

export default app

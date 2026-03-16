import "dotenv/config"
import app from "./app.js"
import pool from "./db/pool.js"

const PORT = Number(process.env.PORT) || 3000

pool.query("SELECT NOW()")
  .then(res => console.log("DB connected:", res.rows))
  .catch(err => console.error(err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
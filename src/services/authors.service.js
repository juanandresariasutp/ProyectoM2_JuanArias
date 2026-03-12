import pool from "../db/pool.js"

// Obtener todos los authors
export const getAllAuthors = async () => {
  const result = await pool.query("SELECT * FROM authors ORDER BY id")
  return result.rows
}

// Obtener author por id
export const getAuthorById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM authors WHERE id = $1",
    [id]
  )

  return result.rows[0]
}

// Crear author
export const createAuthor = async (name, email, bio) => {
  const result = await pool.query(
    `INSERT INTO authors (name, email, bio)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, bio]
  )

  return result.rows[0]
}

// Actualizar author
export const updateAuthor = async (id, name, email, bio) => {
  const result = await pool.query(
    `UPDATE authors
     SET name=$1, email=$2, bio=$3
     WHERE id=$4
     RETURNING *`,
    [name, email, bio, id]
  )

  return result.rows[0]
}

// Eliminar author
export const deleteAuthor = async (id) => {
  await pool.query(
    "DELETE FROM authors WHERE id=$1",
    [id]
  )
}
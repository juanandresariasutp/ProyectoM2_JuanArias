import pool from "../db/pool.js"

// Obtener todos los posts
export const getAllPosts = async () => {
  const result = await pool.query(
    `SELECT * FROM posts ORDER BY id`
  )
  return result.rows
}

// Obtener post por id
export const getPostById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM posts WHERE id=$1`,
    [id]
  )

  return result.rows[0]
}

// Crear post
export const createPost = async (title, content, author_id) => {
  const result = await pool.query(
    `INSERT INTO posts (title, content, author_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [title, content, author_id]
  )

  return result.rows[0]
}

// Actualizar post
export const updatePost = async (id, title, content, author_id) => {
  const result = await pool.query(
    `UPDATE posts
     SET title=$1, content=$2, author_id=$3
     WHERE id=$4
     RETURNING *`,
    [title, content, author_id, id]
  )

  return result.rows[0]
}

// Eliminar post
export const deletePost = async (id) => {
  const result = await pool.query(
    `DELETE FROM posts WHERE id=$1`,
    [id]
  )

  return result.rowCount > 0
}

// Obtener posts por author
export const getPostsByAuthor = async (authorId) => {
  const result = await pool.query(
    `SELECT *
     FROM posts
     WHERE author_id=$1`,
    [authorId]
  )

  return result.rows
}
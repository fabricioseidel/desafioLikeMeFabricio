import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "likeme",
  password: "0498Fabr.", //inicia con tus credenciales
  port: 5432,
});
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Like Me");
});

// Ruta GET para obtener los posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los posts");
  }
});

// Ruta POST para agregar un nuevo post
app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  console.log("Cuerpo de la solicitud:", req.body);
  try {
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)",
      [titulo, url, descripcion]
    );
    console.log("Resultado de la inserción:", result);
    res.status(201).send("Post agregado");
  } catch (err) {
    console.error("Error al agregar el post:", err);
    res.status(500).send("Error al agregar el post");
  }
});
// Ruta Put para agregar  un like y revisar posibles errores
app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).send("Post no encontrado");
    } else {
      res.send("Like agregado");
    }
  } catch (err) {
    console.error("Error al agregar el like:", err);
    res.status(500).send("Error al agregar el like");
  }
});
// Ruta delete para eliminar un post y encontrar posibles errores
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).send("Post no encontrado");
    } else {
      res.send("Post eliminado");
    }
  } catch (err) {
    console.error("Error al eliminar el post:", err);
    res.status(500).send("Error al eliminar el post");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

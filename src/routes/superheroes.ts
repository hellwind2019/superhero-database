import { Router } from "express";
import pool from "../db/db.js";
import multer from "multer";
import { bucket } from "../firebase.js";
const router = Router();
import type { Request } from "express";

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT s.*,
             (
               SELECT image_url
               FROM hero_images i
               WHERE i.hero_id = s.id
               ORDER BY i.id ASC
               LIMIT 1
             ) AS first_image
      FROM superheroes s
      ORDER BY s.id;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM superheroes WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Hero not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/", async (req, res) => {
  const { nickname, real_name, origin_description, superpowers, catch_phrase } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO superheroes (nickname, real_name, origin_description, superpowers, catch_phrase)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nickname, real_name, origin_description, superpowers, catch_phrase]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Insert failed" });
  }
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("BEGIN");
    const images = await pool.query(
      "SELECT image_url FROM hero_images WHERE hero_id = $1",
      [id]
    );
    for (const row of images.rows) {
      const filePath = decodeURIComponent(
        row.image_url.split(`https://storage.googleapis.com/${bucket.name}/`)[1]
      );
      if (filePath) {
        try {
          await bucket.file(filePath).delete();
        } catch (err) {
          console.warn(`Не вдалося видалити файл ${filePath}:`, err);
        }
      }
    }

    await pool.query("DELETE FROM hero_images WHERE hero_id = $1", [id]);
    await pool.query("DELETE FROM superheroes WHERE id = $1", [id]);
    await pool.query("COMMIT");

    res.json({ message: "Hero and images deleted successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error deleting hero:", err);
    res.status(500).json({ message: "Error deleting hero" });
  }
});
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nickname, real_name, origin_description, superpowers, catch_phrase } =
    req.body;
  try {
    const result = await pool.query(
      `UPDATE superheroes
       SET nickname=$1, real_name=$2, origin_description=$3, superpowers=$4, catch_phrase=$5
       WHERE id=$6 RETURNING *`,
      [nickname, real_name, origin_description, superpowers, catch_phrase, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Update failed" });
  }
});

export default router;

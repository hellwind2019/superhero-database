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
    await pool.query("DELETE FROM superheroes WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
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

router.post("/images", async (req, res) => {
  try {
    const { hero_id, image_url, caption } = req.body;

    if (!hero_id || !image_url) {
      return res
        .status(400)
        .json({ error: "hero_id and image_url are required" });
    }

    const query = `
      INSERT INTO hero_images (hero_id, image_url, caption)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [hero_id, image_url, caption || null];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;

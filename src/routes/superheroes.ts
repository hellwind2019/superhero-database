import { Router } from "express";
import pool from "../db/db.js";

import multer from "multer";
import { bucket } from "../firebase.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM superheroes ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
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

const upload = multer({ storage: multer.memoryStorage() });

router.post("/:id/images", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.file) return res.status(400).send("No file uploaded");

    // File name inside Firebase
    const fileName = `superheroes/${id}/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    // Upload buffer to Firebase
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    // Make public (optional)
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    res.json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading image");
  }
});

export default router;

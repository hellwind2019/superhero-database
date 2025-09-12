import { Router } from "express";
import pool from "../db/db.js";
import multer from "multer";
import { bucket } from "../firebase.js";

const image_router = Router();
image_router.post("/", async (req, res) => {
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
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ storage: multer.memoryStorage() });
image_router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    // File name inside Firebase
    const fileName = `superheroes/${Date.now()}_${req.file.originalname}`;
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
export default image_router;

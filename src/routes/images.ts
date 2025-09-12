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
image_router.post("/upload", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).send("No files uploaded");
    }

    const uploadedUrls: string[] = [];

    for (const file of req.files) {
      const f = file as Express.Multer.File;

      const fileName = `superheroes/${Date.now()}_${f.originalname}`;
      const bucketFile = bucket.file(fileName);

      await bucketFile.save(f.buffer, {
        metadata: { contentType: f.mimetype },
      });

      await bucketFile.makePublic();
      uploadedUrls.push(
        `https://storage.googleapis.com/${bucket.name}/${fileName}`
      );
    }

    res.json({ urls: uploadedUrls });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading images");
  }
});
export default image_router;

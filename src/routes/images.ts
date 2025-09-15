import { Router } from "express";
import pool from "../db/db.js";
import multer from "multer";
import { bucket } from "../firebase.js";

const image_router = Router();
image_router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM hero_images WHERE hero_id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Images not found for hero with id: ${id}` });
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
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
image_router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get image data from DB by id
    const result = await pool.query("SELECT url FROM images WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imageUrl = result.rows[0].url;

    // 2. Extract filename from the URL
    // Example URL: https://storage.googleapis.com/my-bucket/superheroes/169477383_image.png
    const filePath = decodeURIComponent(
      imageUrl.split(`https://storage.googleapis.com/${bucket.name}/`)[1]
    );

    if (!filePath) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    // 3. Delete file from bucket
    await bucket.file(filePath).delete();

    // 4. Delete record from DB
    await pool.query("DELETE FROM images WHERE id = $1", [id]);

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: "Error deleting image" });
  }
});

export default image_router;

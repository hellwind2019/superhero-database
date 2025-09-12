import { Router } from "express";
import multer from "multer";
import { bucket } from "../firebase.js";
const router = Router();
import type { Request } from "express";
const upload = multer({ storage: multer.memoryStorage() });

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
router.post("/", upload.single("image"), async (req, res) => {
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

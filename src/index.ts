import express from "express";
import helmet from "helmet";
import router from "./routes/superheroes.js";
import cors from "cors";
import image_router from "./routes/images.js";
const HOST = process.env.HOST || "127.0.0.1";
const PORT: number = Number(process.env.PORT) || 4000;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://hellwind2019.github.io",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "http://127.0.0.1:4000", // твій API
          "ws://localhost:42877/", // Vite hot reload
        ],
        imgSrc: ["'self'", "data:", "https://storage.googleapis.com"],
      },
    },
  })
);
app.use("/api/superheroes", router);
app.use("/api/images", image_router);
app.listen(PORT, HOST, () => {
  console.log(`Server running at port http://${HOST}:${PORT}/`);
});

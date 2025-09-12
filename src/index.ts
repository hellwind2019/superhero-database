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
    origin: ["http://localhost:5173"],
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
          "http://127.0.0.1:8000",
          "ws://localhost:42877/",
        ],
      },
    },
  })
);
app.use("/api/superheroes", router);
app.use("/api/images", image_router);
app.listen(PORT, HOST, () => {
  console.log(`Server running at port http://${HOST}:${PORT}/`);
});

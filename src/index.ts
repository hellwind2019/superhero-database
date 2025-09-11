import express from "express";
import helmet from "helmet";
import router from "./routes/superheroes.js";

const hostname = "127.0.0.1";

const port: number = Number(process.env.PORT) || 4000;
const app = express();

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

app.listen(port, hostname, () => {
  console.log(`Server running at port http://${hostname}:${port}/`);
});

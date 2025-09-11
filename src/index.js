import express from "express";
const hostname = "127.0.0.1";

const port = process.env.PORT || 4000;
const server = express();
export const tasks = [
  { id: 1, title: "Task One", completed: false },
  { id: 2, title: "Task Two", completed: true },
];
server.use(express.json());
server.get("/tasks", (req, res) => {
  res.json(tasks);
});
server.post("/tasks", (req, res) => {
  const newItem = req.body;
  tasks.push(newItem);
  res.json({ message: "Task added successfully", task: newItem });
});
// const server = http.createServer((req, res) => {
//   if (req.method === "GET" && req.url === "/tasks") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify(tasks));
//   } else {
//     res.writeHead(404, { "Content-Type": "text/plain" });
//     res.end(JSON.stringify({ message: "Not Found" }));
//   }
// });

server.listen(port, () => {
  console.log(`Server running at port ${port}/`);
});

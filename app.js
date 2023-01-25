require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// Controllers
const TaskController = require("./controllers/TaskController");
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");
const LogController = require("./controllers/LogController");

// Services
const { requireAuth, validate } = require("./services/UserService");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//rate limiter
const limitRequestsCount = rateLimit({
  max: 1000000000000,
  windowMs: 60 * 1000,
  handler: function (req, res) {
    return res.status(429).send("Too many requests");
  },
});

//http
const server = http.createServer(app);
app.use(
  cors({
    origin: "*",
  })
);
const port = process.env.PORT;
server.listen(port, () => {
  console.log(
    `App running at http://localhost:${port}. Docs at http://localhost:${port}/docs`
  );
});
//ws
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
  socket.onAny(() => {
    io.emit("event");
  });
});

// Routes
app.post("/sessions", limitRequestsCount, validate, SessionController.create);
app.delete(
  "/sessions",
  limitRequestsCount,
  requireAuth,
  SessionController.destroy
);

app.get("/tasks", limitRequestsCount, TaskController.get);
app.post("/tasks", limitRequestsCount, requireAuth, TaskController.create);
app.put("/tasks/:id", limitRequestsCount, requireAuth, TaskController.update);
app.delete(
  "/tasks/:id",
  limitRequestsCount,
  requireAuth,
  TaskController.destroy
);

app.post("/users", limitRequestsCount, UserController.create);

app.get("/logs", limitRequestsCount, LogController.get);

module.exports = app;

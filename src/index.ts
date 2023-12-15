import app from "./app";
import "./database";
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "*",
      "http://localhost:4000",
      "http://localhost:8100",
      "https://tmdb-for-a-angularmovile.onrender.com",
    ],
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// SocketIO
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (data) => {
    socket.join(data.roomId);
    console.log("user joined room: " + data.roomId);
  });

  socket.on("leaveRoom", (data) => {
    socket.leave(data.roomId);
    console.log("user left room: " + data.roomId);
  });

  socket.on("message", (message) => {
    // console.log(message);
    io.to(message.roomId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start
server.listen(app.get("port"));
console.log(`http://localhost:${app.get("port")}`);

app.get("/", function (req, res) {
  res.send(`You should not be here`);
});

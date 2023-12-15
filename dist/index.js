"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("./database");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["*"],
    },
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
server.listen(app_1.default.get("port"));
console.log(`http://localhost:${app_1.default.get("port")}`);
app_1.default.get("/", function (req, res) {
    res.send(`You should not be here`);
});

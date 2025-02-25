const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);
    });

    // Nhận tin nhắn từ client và gửi lại cho tất cả client khác
    socket.on("send-message", ({message, senderId}) => {
        console.log(`Tin nhắn từ ${senderId}: `, message);
        io.emit("receive-message", {message, senderId});
       
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

server.listen(5000, () => console.log("Server running on port 5000"));

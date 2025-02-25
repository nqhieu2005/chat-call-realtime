const peer = new Peer();
const socket = io("http://localhost:5000");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

// Lấy quyền truy cập camera & micro
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then((stream) => {
    myVideo.srcObject = stream;
    myVideo.play();
    videoGrid.append(myVideo);

    // Khi kết nối thành công, gửi ID Peer lên server
    peer.on("open", (id) => {
        socket.emit("join-room", "room1", id);
        socket.id = id; // Lưu ID socket của chính mình
    });
});

// ===================== CHAT FUNCTIONALITY ===================== //

// Lấy phần tử HTML của chat box
const chatInput = document.getElementById("chat-input");
const sendChatButton = document.getElementById("send-chat");
const chatMessages = document.getElementById("chat-messages");

// Sự kiện click gửi tin nhắn
sendChatButton.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message) {
        socket.emit("send-message", { message, senderId: socket.id }); // Gửi cả nội dung và ID người gửi
        chatInput.value = ""; // Xóa input sau khi gửi
    }
});

// Lắng nghe tin nhắn từ server và hiển thị
socket.on("receive-message", ({ message, senderId }) => {
    const messageElement = document.createElement("p");

    // Nếu là tin nhắn của mình thì hiển thị khác
    if (senderId === socket.id) {
        messageElement.innerText = `Bạn: ${message}`;
        messageElement.style.color = "blue"; // Màu xanh cho tin nhắn của bạn
        messageElement.style.textAlign = "right"; // Căn phải tin nhắn của bạn
    } else {
        messageElement.innerText = `Người khác: ${message}`;
        messageElement.style.color = "green"; // Màu xanh lá cho người khác
        messageElement.style.textAlign = "left"; // Căn trái tin nhắn của người khác
    }

    chatMessages.appendChild(messageElement);
});

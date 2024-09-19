import userController from "../../controllers/user.controller.js";
import chatController from "../../controllers/chat.controller.js";

const ioUtils = function (io) {
  io.on("connection", async (socket) => {
    console.log("client is connected", socket.id);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("login", async (userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);
        const welcomeMessage = {
          chat: `${user.name} has joined the room.`,
          user: { id: null, name: "system" },
        };
        io.emit("message", welcomeMessage);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("sendMessage", async (message, cb) => {
      console.log("Message received:", message); // 추가된 로그
      try {
        const user = await userController.checkUser(socket.id);
        const newMessage = await chatController.saveChat(message, user);
        io.emit("message", newMessage);
        cb({ ok: true });
      } catch (error) {
        console.error("Error sending message:", error); // 오류 로그
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("user is disconnected");
    });
  });
};

export default ioUtils;
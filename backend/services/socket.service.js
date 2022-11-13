var gIo = null;
var membersInChat = {};

function connectSockets(http, session) {
  gIo = require("socket.io")(http, {
    cors: {
      origin: "*",
    },
  });
  gIo.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on("disconnect", (socket) => {
      console.log("User Disconnected", socket.id);
    });

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });

   
  });
}

module.exports = {
  connectSockets,
}




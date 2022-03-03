import { Server } from "socket.io";
import { IConversation, IPMessage } from "./src/interfaces";
const io = new Server(8900, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

interface User {
  userId: string;
  socketId: string;
}

interface OnSendMessageProps {
  receiverId: string;
  conversation: IConversation;
  message: IPMessage;
}

let users: User[] = [];

const addUser = (userId: string, socketId: string) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  } else {
    users.forEach((u) => {
      if (u.userId === userId) {
        u.socketId = socketId;
      }
    });
    console.log({ users, userId, socketId });
  }
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId: string) => {
  users = users.filter((u) => u.socketId !== socketId);
};
//  connection
io.on("connection", (socket) => {
  console.log("a user connected");

  // take userId and socketId from user
  socket.on("addUser", (userId: string) => {
    console.log("addUser");

    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send a message

  socket.on(
    "sendMessage",
    async (props: OnSendMessageProps) => {
      const { receiverId, conversation, message } = props;
      try {
        const receiver = await getUser(receiverId);

        console.log({ "sendMessage to": receiver });

        io.to(receiver?.socketId).emit("getMessage", {
          conversation,
          message,
        });
      } catch (error) {
        console.log(error);
      }
    },
  );
  // receive a message

  socket.on(
    "gotMessage",
    async (props: { message: IPMessage }) => {
      const { message } = props;
      try {
        const sender = await getUser(message.senderId._id);

        console.log(sender?.socketId);
        io.to(sender?.socketId).emit("receivedMessage", {
          message,
        });
      } catch (error) {
        console.log(error);
      }
    },
  );

  // messages of conversation have been checked

  socket.on(
    "checkMessage",
    async (props: { messages: IPMessage[] }) => {
      const { messages } = props;
      try {
        for (const message of messages) {
          const sender = await getUser(
            message.senderId._id,
          );
          io.to(sender?.socketId).emit("checkedMessage", {
            message,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  );

  // disconnection

  socket.on("disconnecting", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

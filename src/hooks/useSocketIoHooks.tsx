import { ISocketMessage } from "@/common/libs/socketIo/types";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export const useSocketIoHooks = () => {
  const emit = (data: ISocketMessage) => {
    socket.emit("message", data);
  };

  // const on = (callback: (data: ISocketIoEvent) => void) => {
  //   socket.on("message", (data: ISocketIoEvent) => {
  //     callback(data);
  //   });
  //   return () => {
  //     socket.off("message");
  //   };
  // };
  // const on = (callback: (message: ISocketIoEvent) => void) => {
  //   // Set up a listener for the 'message' event
  //   socket.on("message", (data: { message: ISocketIoEvent }) => {
  //     console.log("Received message:", data.message);
  //     callback(data.message);
  //   });

  //   // Return a cleanup function to remove the listener
  //   return () => {
  //     socket.off("message");
  //   };
  // };

  return {
    emit,
    // on,
  };
};

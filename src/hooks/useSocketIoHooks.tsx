import { ISocketMessage, SocketIoEvent, SocketIoFrom, socket } from "@/common/libs/socketIo/types";
import { io } from "socket.io-client";

// const socket = io(process.env.NEXT_PUBLIC_URL! as string, {
//   path: '/socket.io',
//   transports: ['websocket'],
//   secure: true,
// });

interface IsMessageToMe {
  event: SocketIoEvent[];
  listemTo: SocketIoEvent[]
}

export const useSocketIoHooks = () => {
  const emit = (data: ISocketMessage) => {
    socket.emit("message", data);
  };

  const isMessageToMe = ({
    event,
    listemTo
  }: IsMessageToMe) => {
    return event.some((e) => listemTo.includes(e));
  }

  return {
    emit,
    isMessageToMe
  };
};

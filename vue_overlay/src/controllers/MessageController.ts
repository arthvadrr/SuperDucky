import { io, Socket } from 'socket.io-client'
import state from '@/stores/state.ts'

const socket: Socket = io(
  `http://${import.meta.env.VITE_SERVER_HOST ?? 'localhost'}:${import.meta.env.VITE_SERVER_PORT ?? '3099'}`,
)

console.log(socket);

socket.on('message', (ctx): void => {
  state.messages.push({
    username: ctx.username,
    command: ctx.command,
    messageText: ctx.messageText,
  })
});

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewaySessions } from './gateways.session';
import { AuthenticatedSocket } from './interfaces/AuthenticatedSocket';
import { SendMessageEventPayload } from 'src/common/types';
import { OnEvent } from '@nestjs/event-emitter';
import { MESSAGE_EVENT } from 'src/common/constants/event.constant';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class GatewaysGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gatewaySession: GatewaySessions) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    // this.gatewaySession.setSocket(socket.user.userId, socket)
    // console.log(`Client ${socket.user.userId} connected!`)
    console.log('Client connected!!!');
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    // this.gatewaySession.removeSocket(socket.user.userId)
    // console.log(`Client ${socket.user.userId} disconnected!`)
    console.log('Client disconnected!!!');
  }

  @SubscribeMessage('hello-world')
  sendHelloWorldMessage(message: string) {
    console.log(
      '🚀 ~ GatewaysGateway ~ sendHelloWorldMessage ~ message:',
      message,
    );
    this.server.emit('hello-world', 'Hello World!!!!');
  }

  @OnEvent(MESSAGE_EVENT.SEND_MESSAGE)
  handleSendMessageEvent(payload: SendMessageEventPayload) {
    const {
      conversation: { sender_id, recipient_id },
    } = payload;
    const senderSocket = this.gatewaySession.getClientSocket(sender_id);
    const recipientSocket = this.gatewaySession.getClientSocket(recipient_id);

    if (senderSocket) senderSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
  }
}

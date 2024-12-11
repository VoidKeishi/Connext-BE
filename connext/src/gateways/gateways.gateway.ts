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
import {
  AddNewMemberEventPayload,
  CreateGroupChatEventPayload,
  LeaveGroupEventPayload,
  RemoveMemberEventPayload,
  SendGroupMessageEventPayload,
  SendMessageEventPayload,
  UpdateGroupChatNameEventPayload,
} from 'src/common/types';
import { OnEvent } from '@nestjs/event-emitter';
import {
  GROUP_CHAT_EVENT,
  GROUP_MEMBER_EVENT,
  GROUP_MESSAGE_EVENT,
  MESSAGE_EVENT,
} from 'src/common/constants/event.constant';

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

  @OnEvent(GROUP_CHAT_EVENT.CREATE_NEW_GROUP_CHAT)
  handleCreateNewGroupChat(payload: CreateGroupChatEventPayload) {
    // TODO 1: Take the all id of user
    // TODO 2: Get gatewaySessions, make a loop with it
    // For each clientId that match the id of user in payload, emit an event called 'onGroupChatCreate'
    // along with the payload: CreateGroupChatEventPayload
  }

  @OnEvent(GROUP_CHAT_EVENT.UPDATE_GROUP_CHAT_NAME)
  handleUpdateGroupChatName(payload: UpdateGroupChatNameEventPayload) {
    // The same approach as handleCreateNewGroupChat.
    // Except this time we will emit and event called 'onGroupChatUpdateName'.
  }

  @OnEvent(GROUP_MEMBER_EVENT.ADD_NEW_MEMBERS)
  handleAddNewMembers(payload: AddNewMemberEventPayload) {
    // TODO 1: Take the group id
    // TODO 2: Emit an event called 'onGroupAddMembers along with the payload
    // Make sure that emit to a room name 'group-${group id}'
  }

  @OnEvent(GROUP_MEMBER_EVENT.REMOVE_MEMBER)
  handleRemoveMember(payload: RemoveMemberEventPayload) {
    // TODO 1: Take the group id
    // TODO 2: Find the socket of member that is removed
    // If found, make that user leave the room
    // If not then don't do anything
    // TODO 3: Emit an event called 'onGroupRemoveMember' along with the payload
    // Make sure that emit to a room name 'group-${group id}'
  }

  @OnEvent(GROUP_MEMBER_EVENT.LEAVE_GROUP)
  handleLeaveGroup(payload: LeaveGroupEventPayload) {
    // TODO 1: Take the group id
    // TODO 2: Find the socket of member that leave
    // If found, make that user leave the room
    // If not then don't do anything
    // TODO 3: Emit an event called 'onGroupLeave' along with the payload
    // Make sure that emit to a room name 'group-${group id}'
  }

  @OnEvent(GROUP_MESSAGE_EVENT.SEND_GROUP_MESSAGE)
  handleSendGroupMessage(payload: SendGroupMessageEventPayload) {
    // TODO 1: Take the group id
    // TODO 2: Make the room name using group id: `group-${group id}`
    // TODO 3: Emit an event called 'onSendGroupMessage' along with the payload
    // to the room
  }
}

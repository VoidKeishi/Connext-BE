/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewaySessions } from './gateways.session';
import { AuthenticatedSocket } from './interfaces/AuthenticatedSocket';
import {
  AcceptFriendRequest,
  AddNewMemberEventPayload,
  CreateGroupChatEventPayload,
  LeaveGroupEventPayload,
  NewFriendRequest,
  RemoveMemberEventPayload,
  SendGroupMessageEventPayload,
  SendMessageEventPayload,
  UpdateGroupChatNameEventPayload,
} from 'src/common/types';
import { OnEvent } from '@nestjs/event-emitter';
import {
  FRIEND_EVENT,
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

  handleConnection(socket: AuthenticatedSocket, ..._args: any[]) {
    console.log('Incoming Connection');
    this.gatewaySession.setSocket(socket.user.userId, socket);
    console.log(`Client ${socket.user.userId} connected!`);
    console.log('Client connected!!!');
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.gatewaySession.removeSocket(socket.user.userId);
    console.log(`Client ${socket.user.userId} disconnected!`);
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
      message: {
        conversation_id: { sender_id, recipient_id },
      },
    } = payload;
    const senderSocket = this.gatewaySession.getClientSocket(sender_id.userId);
    const recipientSocket = this.gatewaySession.getClientSocket(
      recipient_id.userId,
    );

    if (senderSocket) senderSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
  }

  @OnEvent(GROUP_CHAT_EVENT.CREATE_NEW_GROUP_CHAT)
  handleCreateNewGroupChat(payload: CreateGroupChatEventPayload) {
    const { members } = payload;
    for (let i = 0; i < members.length; i++) {
      const userSocket = this.gatewaySession.getClientSocket(
        members[i].user_id.userId,
      );
      if (userSocket) userSocket.emit('onGroupChatCreate', payload);
    }
  }

  @OnEvent(GROUP_CHAT_EVENT.UPDATE_GROUP_CHAT_NAME)
  handleUpdateGroupChatName(payload: UpdateGroupChatNameEventPayload) {
    const { members } = payload;
    for (let i = 0; i < members.length; i++) {
      const userSocket = this.gatewaySession.getClientSocket(members[i]);
      if (userSocket) userSocket.emit('onGroupChatUpdateName', payload);
    }
  }

  @OnEvent(GROUP_MEMBER_EVENT.ADD_NEW_MEMBERS)
  handleAddNewMembers(payload: AddNewMemberEventPayload) {
    const { groupChat } = payload;
    const roomName = `group-${groupChat.group_id}`;
    this.server.to(roomName).emit('onGroupAddMembers', payload);
  }

  @OnEvent(GROUP_MEMBER_EVENT.REMOVE_MEMBER)
  handleRemoveMember(payload: RemoveMemberEventPayload) {
    const { groupChat, removedMember } = payload;
    const roomName = `group-${groupChat.group_id}`;
    const removedUserId = removedMember.user_id.userId;
    const removeUserSocket = this.gatewaySession.getClientSocket(removedUserId);
    if (removeUserSocket) {
      removeUserSocket.leave(roomName);
    }
    this.server.to(roomName).emit('onGroupRemoveMember', payload);
  }

  @OnEvent(GROUP_MEMBER_EVENT.LEAVE_GROUP)
  handleLeaveGroup(payload: LeaveGroupEventPayload) {
    // TODO 1: Take the group id
    const { groupChat, leaveMember } = payload;
    const roomName = `group-${groupChat.group_id}`;
    const leaveUserId = leaveMember.user_id.userId;
    const leaveUserSocket = this.gatewaySession.getClientSocket(leaveUserId);
    if (leaveUserSocket) {
      leaveUserSocket.leave(roomName);
    }
    this.server.to(roomName).emit('onGroupLeave', payload);
  }

  @OnEvent(GROUP_MESSAGE_EVENT.SEND_GROUP_MESSAGE)
  handleSendGroupMessage(payload: SendGroupMessageEventPayload) {
    // TODO 1: Take the group id
    // TODO 2: Make the room name using group id: `group-${group id}`
    // TODO 3: Emit an event called 'onSendGroupMessage' along with the payload
    // to the room
  }

  @OnEvent(FRIEND_EVENT.NEW_FRIEND_REQUEST)
  handleNewFriendRequest(payload: NewFriendRequest) {
    // TODO 1: Take the sender and recipient ID
    // TODO 2: Emit and event called 'onNewFriendRequest' along with the payload
  }

  @OnEvent(FRIEND_EVENT.ACCEPT_FRIEND_REQUEST)
  handleAcceptFriendRequest(payload: AcceptFriendRequest) {
    // TODO 1: Take the senderId by using the payload.senderConversation.sender_id.userId
    // TODO 2: Take the recipientId by using the payload.senderConversation.recipient_id.userId
    // TODO 3: Emit and event called 'onAcceptFriendRequest' along with the payload
    // payload.senderConversation to senderId socket
    // payload.recipientConversation to recipientId socket
  }
}

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
  AcceptFriendRequestEventPayload,
  AddNewMemberEventPayload,
  CreateGroupChatEventPayload,
  LeaveGroupEventPayload,
  NewFriendRequestEventPayload,
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
    const { groupMessage } = payload;
    const roomName = `group-${groupMessage.group_id.group_id}`;
    this.server.to(roomName).emit('onSendGroupMessage', payload);
  }

  @OnEvent(FRIEND_EVENT.NEW_FRIEND_REQUEST)
  handleNewFriendRequest(payload: NewFriendRequestEventPayload) {
    const { newFriendRequest } = payload;
    const senderId = newFriendRequest.user_id.userId;
    const recipientId = newFriendRequest.friend_user_id.userId;
    const senderSocket = this.gatewaySession.getClientSocket(senderId);
    const recipientSocket = this.gatewaySession.getClientSocket(recipientId);
    if (senderSocket) senderSocket.emit('onNewFriendRequest', payload);
    if (recipientSocket) recipientSocket.emit('onNewFriendRequest', payload);
  }

  @OnEvent(FRIEND_EVENT.ACCEPT_FRIEND_REQUEST)
  handleAcceptFriendRequest(payload: AcceptFriendRequestEventPayload) {
    const { senderConversation, recipientConversation } = payload;
    const senderId = senderConversation.sender_id.userId;
    const recipientId = senderConversation.recipient_id.userId;
    const senderSocket = this.gatewaySession.getClientSocket(senderId);
    const recipientSocket = this.gatewaySession.getClientSocket(recipientId);
    if (senderSocket)
      senderSocket.emit('onAcceptFriendRequest', senderConversation);
    if (recipientSocket)
      recipientSocket.emit('onAcceptFriendRequest', recipientConversation);
  }
}

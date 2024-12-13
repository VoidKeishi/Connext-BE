import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { FRIEND_EVENT } from 'src/common/constants/event.constant';
import { ResponseFriendRequestDto } from './dto/response-friend-request.dto';
import { FriendshipRepository } from './repositories/friendship.repository';

@Controller('friends')
@UseGuards(AuthGuard)
export class FriendsController {
  constructor(
    private readonly friendshipRepository: FriendshipRepository,
    private readonly friendsService: FriendsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('/new-friend-request')
  async createNewFriendRequest(
    @Req() request: Request,
    @Body() createFriendRequestData: CreateFriendRequestDto,
  ) {
    const newFriendRequest = await this.friendsService.createNewFriendRequest({
      senderId: request['user'].userId,
      recipientId: createFriendRequestData.recipientId,
    });
    this.eventEmitter.emit(FRIEND_EVENT.NEW_FRIEND_REQUEST, newFriendRequest);
    return;
  }

  @Post('/accept-friend-request')
  async acceptFriendRequest(
    @Body() responseFriendRequestData: ResponseFriendRequestDto,
  ) {
    const newConversations = await this.friendsService.acceptFriendRequest({
      friendRequestId: responseFriendRequestData.friendRequestId,
    });
    this.eventEmitter.emit(
      FRIEND_EVENT.ACCEPT_FRIEND_REQUEST,
      newConversations,
    );
    return;
  }

  @Post('/reject-friend-request')
  async rejectFriendRequest(
    @Body() responseFriendRequestData: ResponseFriendRequestDto,
  ) {
    const responseResult = await this.friendsService.rejectFriendRequest({
      friendRequestId: responseFriendRequestData.friendRequestId,
    });
    return responseResult;
  }

  @Get('/friend-requests')
  async getFriendRequest(@Req() request: Request) {
    // Fetching the friend requests for the current user
    const friendRequests = await this.friendshipRepository.getFriendRequests(request['user'].userId);
    return friendRequests;
  }

  @Get('/friends')
  async getFriends(@Req() request: Request) {
    // Fetching the friends for the current user
    const friends = await this.friendshipRepository.getFriends(request['user'].userId);
    return friends;
  }
}

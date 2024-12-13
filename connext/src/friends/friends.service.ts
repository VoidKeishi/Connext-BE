import { Injectable } from '@nestjs/common';
import { FriendshipRepository } from './repositories/friendship.repository';
import { INewFriendRequest } from './interfaces/new-friend-request.interface';
import { UserRepository } from 'src/users/repositories/user.repository';
import { IResponseFriendRequest } from './interfaces/response-friend-request.interface';
import { ConversationRepository } from 'src/conversation/repositories/conversation.repository';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendshipRepository: FriendshipRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createNewFriendRequest(newFriendRequest: INewFriendRequest) {
    // TODO 1: Check if recipient exist. If not exist, throw NotFoundException
    // TODO 2: Get request sender using userRepository.findOneById(newFriendRequest.senderId)
    // TODO 3: Create new friend request using friendshipRepository.createNewFriendRequest()
    // TODO 4: Return new friend request
  }

  async acceptFriendRequest(acceptFriendRequest: IResponseFriendRequest) {
    // TODO 1: Check if this friend requet exist using friendshipRepository.getFriendRequestById
    // If not exist, throw NotFoundException
    // TODO 2: Check if the status of this friend request is FRIENDSHIP_STATUS.FRIEND.
    // If it is, throw new BadRequestException
    // TODO 3: Update friend request using friendshipRepository.updateFriendRequestStatus()
    // Remember to pass the enum FRIENDSHIP_STATUS.FRIEND
    // TODO 4: Create 2 new conversations using conversationRepository.createNewConversation
    // The first conversation is the conversation of the person that make the friend request
    // The second conversation is the conversation of the person that recieve and accept the friend request
    // TODO 5: Return 2 new conversations.
  }

  async rejectFriendRequest(rejectFriendRequest: IResponseFriendRequest) {
    // TODO 1: Check if this friend requet exist using friendshipRepository.getFriendRequestById
    // If not exist, throw NotFoundException
    // TODO 2: Delete the friend request using friendshipRepository.deleteFriendRequest()
    // TODO 3: Return true if delete success. Else throw new InternalServerException
  }

  // 4. Get all friendships
  // 5. Get all pending friend request
}

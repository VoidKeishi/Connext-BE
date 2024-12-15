import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FriendshipRepository } from './repositories/friendship.repository';
import { INewFriendRequest } from './interfaces/new-friend-request.interface';
import { UserRepository } from 'src/users/repositories/user.repository';
import { IResponseFriendRequest } from './interfaces/response-friend-request.interface';
import { ConversationRepository } from 'src/conversation/repositories/conversation.repository';
import { FRIENDSHIP_STATUS } from 'src/common/enum/friendship-status.enum';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendshipRepository: FriendshipRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createNewFriendRequest(newFriendRequest: INewFriendRequest) {
    const recipient = await this.userRepository.findOneById(
      newFriendRequest.recipientId,
    );
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    const sender = await this.userRepository.findOneById(
      newFriendRequest.senderId,
    );
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const foundFriendRequest =
      await this.friendshipRepository.getUserFriendRequestBySenderAndRecipient(
        sender,
        recipient,
      );
    if (foundFriendRequest)
      throw new BadRequestException('Friend request already exist!');

    const createdFriendRequest =
      await this.friendshipRepository.createNewFriendRequest(sender, recipient);
    return createdFriendRequest;
  }

  async acceptFriendRequest(acceptFriendRequest: IResponseFriendRequest) {
    const friendRequest = await this.friendshipRepository.getFriendRequestById(
      acceptFriendRequest.friendRequestId,
    );

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendRequest.status === FRIENDSHIP_STATUS.FRIEND) {
      throw new BadRequestException(
        'This friend request has already been accepted',
      );
    }

    await this.friendshipRepository.updateFriendRequestStatus(
      acceptFriendRequest.friendRequestId,
      FRIENDSHIP_STATUS.FRIEND,
    );

    const firstParticipant = friendRequest.user_id;
    const secondParticipant = friendRequest.friend_user_id;
    const conversation =
      await this.conversationRepository.createNewConversation(
        firstParticipant,
        secondParticipant,
      );

    return conversation;
  }

  async rejectFriendRequest(rejectFriendRequest: IResponseFriendRequest) {
    const friendRequest = await this.friendshipRepository.getFriendRequestById(
      rejectFriendRequest.friendRequestId,
    );

    if (!friendRequest) {
      throw new NotFoundException('No friend request found!');
    }

    const deleteResult = await this.friendshipRepository.deleteFriendRequest(
      rejectFriendRequest.friendRequestId,
    );

    if (deleteResult.affected > 0) {
      return true;
    } else {
      throw new InternalServerErrorException('Failed to delete');
    }
  }
}

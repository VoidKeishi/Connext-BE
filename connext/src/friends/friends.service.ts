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
    if (newFriendRequest.senderId === newFriendRequest.recipientId)
      throw new BadRequestException('Can not send friend request to yourself!');

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
    if (
      foundFriendRequest &&
      foundFriendRequest.status === FRIENDSHIP_STATUS.PENDING
    )
      throw new BadRequestException('Friend request already exist!');
    if (
      foundFriendRequest &&
      foundFriendRequest.status === FRIENDSHIP_STATUS.FRIEND
    )
      throw new BadRequestException(
        `${foundFriendRequest.friend_user_id.username} is already your friend`,
      );

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

    if (friendRequest.user_id.userId === acceptFriendRequest.issuer)
      throw new BadRequestException('Can not accept your own friend request');

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

    if (friendRequest.user_id.userId === rejectFriendRequest.issuer)
      throw new BadRequestException('Can not reject your own friend request');

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

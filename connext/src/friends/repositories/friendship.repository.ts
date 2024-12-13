import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Friendship } from '../entities/friendship.entity';
import { FRIENDSHIP_STATUS } from 'src/common/enum/friendship-status.enum';

@Injectable()
export class FriendshipRepository {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}

  async getFriends(userId: number): Promise<Friendship[]> {
    return await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user_id', 'user')
      .where('user.user_id = :userId', { userId: userId })
      .andWhere('friendship.status = :status', {
        status: FRIENDSHIP_STATUS.FRIEND,
      })
      .getMany();
  }

  async getFriendRequestById(
    friendRequestId: number,
  ): Promise<Friendship | null> {
    return await this.friendshipRepository.findOne({
      where: { friendship_id: friendRequestId },
    });
  }

  async getFriendRequests(userId: number): Promise<Friendship[]> {
    return await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user_id', 'user')
      .where('user.user_id = :userId', { userId: userId })
      .andWhere('friendship.status = :status', {
        status: FRIENDSHIP_STATUS.PENDING,
      })
      .getMany();
  }

  async createNewFriendRequest(
    sender: User,
    recipient: User,
  ): Promise<Friendship> {
    const newFriendRequest = new Friendship();
    newFriendRequest.user_id = sender;
    newFriendRequest.friend_user_id = recipient;
    newFriendRequest.status = FRIENDSHIP_STATUS.PENDING;
    const newFriendRequestData =
      await this.friendshipRepository.save(newFriendRequest);

    return newFriendRequestData;
  }

  async updateFriendRequestStatus(
    friendrequestId: number,
    status: FRIENDSHIP_STATUS,
  ) {
    await this.friendshipRepository
      .createQueryBuilder()
      .update(Friendship)
      .set({
        status: status,
      })
      .where('friendship_id = :id', { id: friendrequestId })
      .execute();
    return await this.friendshipRepository.findOne({
      where: { friendship_id: friendrequestId },
      relations: {
        user_id: true,
        friend_user_id: true,
      },
    });
  }

  async deleteFriendRequest(friendrequestId: number) {
    const deleteResult = await this.friendshipRepository
      .createQueryBuilder()
      .delete()
      .from(Friendship)
      .where('friendship_id = :id', { id: friendrequestId })
      .execute();
    return deleteResult;
  }
}

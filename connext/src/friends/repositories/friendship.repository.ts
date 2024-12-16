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

  async getOneFriend(
    userId: number,
    friendUserId: number,
  ): Promise<Friendship> {
    return await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user_id', 'user')
      .leftJoinAndSelect('friendship.friend_user_id', 'friend')
      .where('user.user_id = :userId AND friend.user_id = :friendUserId', {
        userId: userId,
        friendUserId: friendUserId,
      })
      .orWhere('user.user_id = :friendUserId AND friend.user_id = :userId', {
        userId: userId,
        friendUserId: friendUserId,
      })
      .andWhere('friendship.status = :status', {
        status: FRIENDSHIP_STATUS.FRIEND,
      })
      .select([
        'friendship',
        'user.userId',
        'user.username',
        'user.email',
        'user.nickName',
        'user.avatarUrl',
        'user.isOnline',
        'friend.userId',
        'friend.username',
        'friend.email',
        'friend.nickName',
        'friend.avatarUrl',
        'friend.isOnline',
      ])
      .getOne();
  }

  async getFriends(userId: number): Promise<Friendship[]> {
    return await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user_id', 'user')
      .leftJoinAndSelect('friendship.friend_user_id', 'friend')
      .where('user.user_id = :userId', { userId: userId })
      .orWhere('friend.user_id = :userId', { userId: userId })
      .andWhere('friendship.status = :status', {
        status: FRIENDSHIP_STATUS.FRIEND,
      })
      .select([
        'friendship',
        'user.userId',
        'user.username',
        'user.email',
        'user.nickName',
        'user.avatarUrl',
        'user.isOnline',
        'friend.userId',
        'friend.username',
        'friend.email',
        'friend.nickName',
        'friend.avatarUrl',
        'friend.isOnline',
      ])
      .getMany();
  }

  async getFriendRequestById(
    friendRequestId: number,
  ): Promise<Friendship | null> {
    return await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user_id', 'user')
      .leftJoinAndSelect('friendship.friend_user_id', 'friend')
      .where('friendship.friendship_id = :id', { id: friendRequestId })
      .getOne();
  }

  async getReceivedFriendRequests(userId: number): Promise<Friendship[]> {
    return await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user_id', 'user')
      .leftJoinAndSelect('friendship.friend_user_id', 'friend')
      .where('friend.user_id = :userId', { userId: userId })
      .andWhere('friendship.status = :status', {
        status: FRIENDSHIP_STATUS.PENDING,
      })
      .select([
        'friendship',
        'user.userId',
        'user.username',
        'user.email',
        'user.nickName',
        'user.avatarUrl',
        'user.isOnline',
        'friend.userId',
        'friend.username',
        'friend.email',
        'friend.nickName',
        'friend.avatarUrl',
        'friend.isOnline',
      ])
      .getMany();
  }

  async getSentFriendRequests(userId: number): Promise<Friendship[]> {
    return await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user_id', 'user')
      .leftJoinAndSelect('friendship.friend_user_id', 'friend')
      .where('user.user_id = :userId', { userId: userId })
      .andWhere('friendship.status = :status', {
        status: FRIENDSHIP_STATUS.PENDING,
      })
      .select([
        'friendship',
        'user.userId',
        'user.username',
        'user.email',
        'user.nickName',
        'user.avatarUrl',
        'user.isOnline',
        'friend.userId',
        'friend.username',
        'friend.email',
        'friend.nickName',
        'friend.avatarUrl',
        'friend.isOnline',
      ])
      .getMany();
  }

  async getUserFriendRequestBySenderAndRecipient(
    sender: User,
    recipient: User,
  ): Promise<Friendship> {
    return await this.friendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.user_id', 'sender')
      .leftJoinAndSelect('friendship.friend_user_id', 'recipient')
      .where(
        'sender.user_id = :senderId AND recipient.user_id = :recipientId',
        { senderId: sender.userId, recipientId: recipient.userId },
      )
      .orWhere(
        'sender.user_id = :recipientId AND recipient.user_id = :senderId',
        { senderId: sender.userId, recipientId: recipient.userId },
      )
      .getOne();
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
    newFriendRequestData.user_id.passwordHashed = '';
    newFriendRequestData.friend_user_id.passwordHashed = '';
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

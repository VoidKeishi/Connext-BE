import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from 'src/friends/entities/friendship.entity';
import { FRIENDSHIP_STATUS } from 'src/common/enum/friendship-status.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      .where(
        new Brackets((qb) => {
          qb.where('user.user_id = :userId', { userId }).orWhere(
            'friend.user_id = :userId',
            { userId },
          );
        }),
      )
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

  async countTotalUsers(userId: number): Promise<number> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_id != :id', { id: userId })
      .getCount();
  }

  async findManyUsers(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_id != :id', { id: userId })
      .skip((offset - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findOneById(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { userId: userId } });
  }

  async findOneByUserName(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async countUsersByEmailOrUsername(
    userId: number,
    query: string,
  ): Promise<number> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(
        new Brackets((qb) => {
          qb.where('user.email LIKE :email', { email: `%${query}%` }).orWhere(
            'user.username LIKE :username',
            { username: `${query}` },
          );
        }),
      )
      .andWhere('user.user_id != :id', { id: userId })
      .getCount();
  }

  async findManyUsersByEmailOrUsername(
    userId: number,
    query: string,
    limit: number,
    offset: number,
  ): Promise<User[] | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(
        new Brackets((qb) => {
          qb.where('user.email LIKE :email', { email: `%${query}%` }).orWhere(
            'user.username LIKE :username',
            { username: `${query}` },
          );
        }),
      )
      .andWhere('user.user_id != :id', { id: userId })
      .select(['user.userId', 'user.username', 'user.email', 'user.avatarUrl'])
      .limit(limit)
      .offset(offset - 1)
      .getMany();
  }

  async createNewUser(createUserData: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserData);
    return await this.userRepository.save(newUser);
  }

  async updateUser(userId: number, updateUserData: UpdateUserDto) {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserData)
      .where('user_id = :userId', { userId })
      .execute();
    return await this.userRepository.findOne({ where: { userId: userId } });
  }

  async deleteUser(userId: number) {
    return await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('user_id = :userId', { userId })
      .execute();
  }
}

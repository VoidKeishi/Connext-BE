import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import excludeObjectKeys from 'src/common/utils/excludeObjectKeys';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async findOne(userId: number) {
    const foundUser = await this.usersRepository.findOneById(userId);
    if (!foundUser) throw new NotFoundException('No user found!');

    return excludeObjectKeys(foundUser, ['passwordHashed']);
  }

  async findManyUsers(userId: number, limit: number, offset: number) {
    const totalUsers = await this.usersRepository.countTotalUsers(userId);
    const totalPages = Math.ceil(totalUsers / limit);
    const foundUsers = await this.usersRepository.findManyUsers(
      userId,
      limit,
      offset,
    );
    const transformedUsers = [];
    for (let i = 0; i < foundUsers.length; i++) {
      const isFriend = await this.usersRepository.getOneFriend(
        userId,
        foundUsers[i].userId,
      );
      let transformedUser = {};
      if (isFriend) {
        transformedUser = {
          ...foundUsers[i],
          isFriend: true,
        };
      } else {
        transformedUser = {
          ...foundUsers[i],
          isFriend: false,
        };
      }
      transformedUsers.push(
        excludeObjectKeys(transformedUser, ['passwordHashed']),
      );
    }
    return {
      data: transformedUsers,
      pagination: {
        totalResult: totalUsers,
        totalPages: totalPages,
        currentPage: offset,
        limitPerPage: limit,
      },
    };
  }

  async searchUsers(
    userId: number,
    query: string,
    limit: number,
    offset: number,
  ) {
    const totalUsers = await this.usersRepository.countUsersByEmailOrUsername(
      userId,
      query,
    );
    const totalPages = Math.ceil(totalUsers / limit);
    const foundUsers =
      await this.usersRepository.findManyUsersByEmailOrUsername(
        userId,
        query,
        limit,
        offset,
      );

    const transformedUsers = [];
    for (let i = 0; i < foundUsers.length; i++) {
      const isFriend = await this.usersRepository.getOneFriend(
        userId,
        foundUsers[i].userId,
      );
      let transformedUser = {};
      if (isFriend) {
        transformedUser = {
          ...foundUsers[i],
          isFriend: true,
        };
      } else {
        transformedUser = {
          ...foundUsers[i],
          isFriend: false,
        };
      }
      transformedUsers.push(
        excludeObjectKeys(transformedUser, ['passwordHashed']),
      );
    }
    return {
      result: transformedUsers,
      pagination: {
        totalResult: totalUsers,
        totalPages: totalPages,
        currentPage: offset,
        limitPerPage: limit,
      },
    };
  }

  async checkUserOnlineStatus(userId: number) {
    const foundUsers = await this.usersRepository.getFriends(userId);
    const transformedUsers = [];
    for (let i = 0; i < foundUsers.length; i++) {
      transformedUsers.push({
        userId:
          foundUsers[i].user_id.userId == userId
            ? foundUsers[i].friend_user_id.userId
            : foundUsers[i].user_id.userId,
        isOnline:
          foundUsers[i].user_id.userId == userId
            ? foundUsers[i].friend_user_id.isOnline
            : foundUsers[i].user_id.isOnline,
      });
    }
    return transformedUsers;
  }

  async updateUser(userId: number, updateUserData: UpdateUserDto) {
    const foundUser = await this.usersRepository.findOneById(userId);
    if (!foundUser) throw new NotFoundException('No user found!');

    const updateResult = await this.usersRepository.updateUser(
      userId,
      updateUserData,
    );
    if (!updateResult)
      throw new InternalServerErrorException('Oops! Something went wrong');

    const updatedUser = await this.usersRepository.findOneById(userId);
    return excludeObjectKeys(updatedUser, ['passwordHashed']);
  }

  async deleteUser(userId: number) {
    const foundUser = await this.usersRepository.findOneById(userId);
    if (!foundUser) throw new NotFoundException('No user found!');

    const deleteResult = await this.usersRepository.deleteUser(userId);
    if (!deleteResult.affected)
      throw new InternalServerErrorException('Oops! Something went wrong');

    return true;
  }
}

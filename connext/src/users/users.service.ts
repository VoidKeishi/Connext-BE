import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { userName, passwordHashed, email, dateOfBirth, nickName, isOnline } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(passwordHashed, salt);

    const user = this.userRepository.create({
      userName,
      passwordHashed: hashedPassword,
      email,
      dateOfBirth,
      nickName,
      isOnline,
    });
    await this.userRepository.save(user);
    return user;
  }

  async authenticateViaUsername(userName: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneByUserName(userName);

    if (user && (await bcrypt.compare(password, user.passwordHashed))) {
      return { username: user.userName };
    }

    return null;
  }

  async authenticateViaEmail(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.passwordHashed))) {
      return { username: user.userName };
    }
    return null;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const { userId, userName, passwordHashed, email, nickName, avatarUrl, dateOfBirth } = updateUserDto;

    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (passwordHashed) {
      const salt = await bcrypt.genSalt();
      user.passwordHashed = await bcrypt.hash(passwordHashed, salt);
    }
    user.userName = userName ?? user.userName;
    user.email = email ?? user.email;
    user.nickName = nickName ?? user.nickName;
    user.avatarUrl = avatarUrl ?? user.avatarUrl;
    user.dateOfBirth = dateOfBirth ?? user.dateOfBirth;

    return await this.userRepository.save(user);
  }

  async deleteAccount(userName: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { userName } });

    if (user && (await bcrypt.compare(password, user.passwordHashed))) {
      await this.userRepository.remove(user);
      return `Account deleted successfully.`;
    }
    return `Failed to delete account. Incorrect password or user not found.`;
  }
}

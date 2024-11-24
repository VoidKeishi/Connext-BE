import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { MessagesConstant } from 'src/common/constants/messages.constant';
import { ErrorsConstant } from 'src/common/constants/errors.constant';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto): Promise<string> {
    const { userName, passwordHashed, email, dateOfBirth, nickName, isOnline } = createUserDto;
  
    try {
      const existingUserByUserName = await this.userRepository.findOneByUserName(userName);
      const existingUserByEmail = await this.userRepository.findOneByEmail(email);
  
      if (existingUserByUserName || existingUserByEmail) {
        throw new Error(ErrorsConstant.ERROR_USER_ALREADY_EXISTS);
      }
  
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
      return MessagesConstant.USER_REGISTERED_SUCCESS;
    } catch (error) {
      return ErrorsConstant.USER_REGISTRATION_FAILED;
    }
  }

  async authenticateViaUsername(userName: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneByUserName(userName);
      if (user && await bcrypt.compare(password, user.passwordHashed)) {
        return MessagesConstant.USER_LOGGED_IN;
      }
  
      return ErrorsConstant.ERROR_INVALID_CREDENTIALS;
    } catch (error) {
      return ErrorsConstant.ERROR_INVALID_CREDENTIALS;
    }
  }
  
  async authenticateViaEmail(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneByEmail(email);
      if (user && await bcrypt.compare(password, user.passwordHashed)) {
        return MessagesConstant.USER_LOGGED_IN;
      }
  
      return ErrorsConstant.ERROR_INVALID_CREDENTIALS;
    } catch (error) {
      return ErrorsConstant.ERROR_INVALID_CREDENTIALS;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<string> {
    const { userId, userName, passwordHashed, email, nickName, avatarUrl, dateOfBirth } = updateUserDto;

    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw ErrorsConstant.ERROR_USER_NOT_FOUND;
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

    return MessagesConstant.USER_UPDATED_SUCCESS;
  }

  async deleteAccount(userName: string, password: string): Promise<string> {
    const user = await this.userRepository.findOneByUserName(userName);

    if (user && (await bcrypt.compare(password, user.passwordHashed))) {
      await this.userRepository.remove(user);
      return MessagesConstant.USER_DELETE_SUCCESS;
    }
    return `Failed to delete account`;
  }
}

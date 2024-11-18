import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
  ) {}

  async register(
      userName: string,
      password: string,
      email: string,
      dateOfBirth: string,
      nickName: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      userName,
      passwordHashed: passwordHashed,
      email,
      dateOfBirth,
      nickName,
    });
    await this.userRepository.save(user);
    return user;
  }

  async authenticateViaUsername(
      userName: string,
      password: string,
  ): Promise<any> {
    const user = await this.userRepository.findOne({ where: { userName } });

    if (user && (await bcrypt.compare(password, user.passwordHashed))) {
      return { username: user.userName };
    }
    return null;
  }

  async authenticateViaEmail(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.passwordHashed))) {
      return { username: user.userName };
    }
    return null;
  }

  async changeInfo(
      userName: string,
      password: string,
      email: string,
      nickName: string,
      avatar_url: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userName } });

    user.passwordHashed = password;
    user.email = email;
    user.nickName = nickName;
    user.avatarUrl = avatar_url;

    return await this.userRepository.save(user);
  }

  async deleteAccount(userName: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { userName } });

    if (user && (await bcrypt.compare(password, user.passwordHashed))) {
      await this.userRepository.remove(user);
      return `Deleted.`;
    }
    return `Failed`;
  }
}

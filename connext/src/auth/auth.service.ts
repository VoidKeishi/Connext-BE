import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/users/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { jwtSign } from './jwt.strategy';
import { excludeObjectKeys } from 'src/common/utils/excludeObjectKeys';
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from 'src/common/constants/jwt.constant';
import { MessagesConstant } from 'src/common/constants/messages.constant';
import { ErrorsConstant } from 'src/common/constants/errors.constant';
import { Role } from './role-enum';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_KEY: string;
  private REFRESH_TOKEN_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    this.ACCESS_TOKEN_KEY = this.configService.get<string>('AT_SECRET_KEY');
    this.REFRESH_TOKEN_KEY = this.configService.get<string>('RT_SECRET_KEY');
  }

  async signin({ userName, email, password }: { userName?: string; email?: string; password: string }) {
    const user = email
      ? await this.userRepository.findOneByEmail(email)
      : await this.userRepository.findOneByUserName(userName);

    if (!user) {
      throw new NotFoundException(ErrorsConstant.ERROR_USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHashed);
    if (!isPasswordValid) {
      throw new BadRequestException(ErrorsConstant.ERROR_INVALID_CREDENTIALS);
    }

    const payload = { user_id: user.userId, email: user.email, role: user.role };

    const accessToken = jwtSign(payload, this.ACCESS_TOKEN_KEY, ACCESS_TOKEN_EXPIRE);
    const refreshToken = jwtSign(payload, this.REFRESH_TOKEN_KEY, REFRESH_TOKEN_EXPIRE);

    const userWithoutPassword = excludeObjectKeys(user, ['passwordHashed']);

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
      message: MessagesConstant.USER_LOGGED_IN,
    };
  }

  async signup({ email, password, role }: { email: string; password: string; role: Role }) {
    const existingUser = await this.userRepository.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException(ErrorsConstant.ERROR_USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.createNewUser({
      email,
      passwordHashed: hashedPassword,
      role,
    });

    const payload = { user_id: newUser.userId, email: newUser.email, role: newUser.role };

    const accessToken = jwtSign(payload, this.ACCESS_TOKEN_KEY, ACCESS_TOKEN_EXPIRE);
    const refreshToken = jwtSign(payload, this.REFRESH_TOKEN_KEY, REFRESH_TOKEN_EXPIRE);

    const userWithoutPassword = excludeObjectKeys(newUser, ['passwordHashed']);

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
      message: MessagesConstant.USER_REGISTERED_SUCCESS,
    };
  }

  async logout(userId: number) {
    await this.userRepository.updateUser(userId, {
      isOnline: false,
      lastActiveAt: new Date(),
      lastLogin: new Date(),
    });

    return { message: MessagesConstant.USER_LOGOUT_SUCCESS };
  }
}

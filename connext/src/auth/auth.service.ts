import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_KEY: string
  private REFRESH_TOKEN_KEY: string

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository, // Use this to query to User table in Database
  ) {
    this.ACCESS_TOKEN_KEY = this.configService.get<string>('AT_SECRET_KEY')
    this.REFRESH_TOKEN_KEY = this.configService.get<string>('RT_SECRET_KEY')
  }

  async signin({ email, password }) {
    // TODO: Check if user exist in Database using email. If not, throw new NotFoundException
    
    // TODO: Check if password is correct. If not, throw new BadRequestExecption

    // TODO: Construct payload for JWT. Check the Payload type in jwt.strategy.ts

    // TODO: Use the jwtSign function in jwt.strategy.ts to generate access token.
    // Remember to provide the correct secret key and the correct expire time.
    // You can find the expire time of each token using the constant in jwt.constant.ts in common/constants

    // TODO: Use the jwtSign function in jwt.strategy.ts to generate refresh token
    // Remember to provide the correct secret key and the correct expire time.
    // You can find the expire time of each token using the constant in jwt.constant.ts in common/constants
    
    // TODO: Return access token, refresh token and user information that exclude the password
    // You can use the excludeObjectKeys.ts file to exclude the password
    // Checkout how to use it in the findOne service of Users Module
  }

  async signup({ email, password }) {
    // TODO: Check if user already exist in Database using email. If yes, throw new BadRequestException
    
    // TODO: Hash the password

    // TODO: Create new user

    // TODO: Construct payload for JWT. Check the Payload type in jwt.strategy.ts

    // TODO: Use the jwtSign function in jwt.strategy.ts to generate access token.
    // Remember to provide the correct secret key and the correct expire time.
    // You can find the expire time of each token using the constant in jwt.constant.ts in common/constants

    // TODO: Use the jwtSign function in jwt.strategy.ts to generate refresh token
    // Remember to provide the correct secret key and the correct expire time.
    // You can find the expire time of each token using the constant in jwt.constant.ts in common/constants
    
    // TODO: Return access token, refresh token and user information that exclude the password
    // You can use the excludeObjectKeys.ts file to exclude the password
    // Checkout how to use it in the findOne service of Users Module
  }

  async logout(userId: number) {
    // TODO: Update user is_online, last_active_at and last_login field
    // TODO: Return true
  }
}

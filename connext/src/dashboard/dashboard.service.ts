import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly userRepository: UserRepository) {}

  async getTotalUsers(userId: number) {
    const totalUser = await this.userRepository.countTotalUsers(userId);
    return totalUser + 1;
  }

  async getTotalOnlineUsers() {
    const totalOnlineUser = await this.userRepository.countTotalOnlineUser();
    return totalOnlineUser;
  }

  async getTotalUserPerMonth() {
    const result = await this.userRepository.countUsersPerMonth();
    return result;
  }
}

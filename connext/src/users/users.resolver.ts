import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => User, { name: 'user' })
  findOneUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.usersService.findOne(userId);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUser') updateUserData: UpdateUserDto) {
    return await this.usersService.updateUser(updateUserData.userId, updateUserData);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('userId', { type: () => Int }) userId: number) {
    return await this.usersService.deleteUser(userId);
  }
}

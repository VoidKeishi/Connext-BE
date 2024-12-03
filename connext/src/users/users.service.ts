import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import excludeObjectKeys from 'src/common/utils/excludeObjectKeys';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) { }

  async findOne(userId: number) {
    const foundUser = await this.usersRepository.findOneById(userId)
    if (!foundUser) throw new NotFoundException("No user found!")

    return excludeObjectKeys(foundUser, ['passwordHashed'])
  }

  async updateUser(userId: number, updateUserData: UpdateUserDto) {
    const foundUser = await this.usersRepository.findOneById(userId)
    if (!foundUser) throw new NotFoundException("No user found!")

    const updateResult = await this.usersRepository.updateUser(userId, updateUserData)
    if (!updateResult) throw new InternalServerErrorException("Oops! Something went wrong")

    const updatedUser = await this.usersRepository.findOneById(userId)
    return excludeObjectKeys(updatedUser, ['passwordHashed'])
  }

  async deleteUser(userId: number) {
    const foundUser = await this.usersRepository.findOneById(userId)
    if (!foundUser) throw new NotFoundException("No user found!")

    const deleteResult = await this.usersRepository.deleteUser(userId)
    if (!deleteResult.affected) throw new InternalServerErrorException("Oops! Something went wrong")

    return true
  }
}

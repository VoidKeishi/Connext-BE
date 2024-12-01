import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/users.repositories';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async findOne(userId: number) {
    const foundUser = await this.usersRepository.findOneById(userId)
    if (!foundUser) throw new NotFoundException("No user found!")
    
    return foundUser
  }

  async updateUser(userId: number, updateUserData: UpdateUserDto): Promise<User> {    
    const foundUser = await this.usersRepository.findOneById(userId)
    if (!foundUser) throw new NotFoundException("No user found!")

    const updateResult = await this.usersRepository.updateUser(userId, updateUserData)
    if (!updateResult) throw new InternalServerErrorException("Oops! Something went wrong")

    const updatedUser = await this.usersRepository.findOneById(userId)
    updatedUser.dateOfBirth = new Date(updatedUser.dateOfBirth)
    return updatedUser
  }

  async deleteUser(userId: number) {
    const foundUser = await this.usersRepository.findOneById(userId)
    if (!foundUser) throw new NotFoundException("No user found!")

    const deleteResult = await this.usersRepository.deleteUser(userId)
    if (!deleteResult.affected) throw new InternalServerErrorException("Oops! Something went wrong")

    return true
  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAllUser(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOneById(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { userId: userId } })
  }

  async findOneByUserName(userName: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { userName } });
  }
  
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createNewUser(createUserData: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserData)
    return await this.userRepository.save(newUser)
  }

  async updateUser(userId: number, updateUserData: UpdateUserDto) {
    return await this.userRepository.createQueryBuilder()
                .update(User)
                .set(updateUserData)
                .where("user_id = :userId", { userId })
                .execute()
  }

  async deleteUser(userId: number) {
    return await this.userRepository.createQueryBuilder()
                .delete()
                .from(User)
                .where("user_id = :userId", { userId })
                .execute()
  }
}

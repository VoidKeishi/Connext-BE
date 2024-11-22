import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findOneByUserName(userName: string): Promise<User> {
    return this.findOne({ where: { userName } });
  }
  
  async findOneByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.find();
  }
}

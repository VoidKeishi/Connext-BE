import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async authenticateViaUsername(userName: string, password: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { userName } });
        return user ? user.password === password : false;
    }

    async authenticateByEmail(email: string, password: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user ? user.password === password : false;
    }

    async signUp(userName: string, email: string, password: string): Promise<boolean> {
        const exists = await this.userRepository.findOne({ where: [{ userName }, { email }] });
        if (exists) return false;

        const newUser = this.userRepository.create({ userName, email, password });
        await this.userRepository.save(newUser);
        return true;
    }
}

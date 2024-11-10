import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(userName: string, password: string, email: string, dateOfBirth: string, nickName: string): Promise<User>;
    authenticateViaUsername(userName: string, password: string): Promise<any>;
    authenticateViaEmail(email: string, password: string): Promise<any>;
    changeInfo(userName: string, password: string, email: string, nickName: string, avatar_url: string): Promise<User>;
}

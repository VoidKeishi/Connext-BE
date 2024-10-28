import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    authenticateViaUsername(userName: string, password: string): Promise<boolean>;
    authenticateByEmail(email: string, password: string): Promise<boolean>;
    signUp(userName: string, email: string, password: string): Promise<boolean>;
}

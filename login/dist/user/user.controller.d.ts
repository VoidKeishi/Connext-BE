import { UserService } from './user.service';
import { User } from "./user.entity";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(userName: string, password: string, email: string, dateOfBirth: string, nickName: string): Promise<User>;
    loginViaUsername(body: {
        userName: string;
        password: string;
    }): Promise<"Login successful!" | "Invalid username or password!">;
    loginViaEmail(body: {
        email: string;
        password: string;
    }): Promise<"Login successful!" | "Invalid email or password!">;
    changeInfo(body: {
        userName?: string;
        password?: string;
        email?: string;
        nickName?: string;
        avatar_url?: string;
    }): Promise<User>;
}

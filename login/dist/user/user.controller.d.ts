import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    loginViaUsername(body: {
        userName: string;
        password: string;
    }): Promise<"Login successful!" | "Invalid username or password!">;
    loginViaEmail(body: {
        email: string;
        password: string;
    }): Promise<"Login successful!" | "Invalid email or password!">;
    signUp(body: {
        userName: string;
        email: string;
        password: string;
    }): Promise<"Sign up successful!" | "Username or email already exists!">;
}

import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Role } from "../role-enum";

export class AuthDto extends User {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  userName: string; 

  @IsString()
  role: Role;

}
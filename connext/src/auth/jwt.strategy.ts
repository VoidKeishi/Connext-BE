import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Role } from 'src/common/enum/role-enum';

type Payload = {
  email: string;
  userId: number;
  username: string;
  role: Role;
};

export const jwtSign = (
  payload: Payload,
  secretKey: string,
  expiresIn: string,
) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });
  return token;
};

export const verifyToken = (token: string, secretKey: string) => {
  try {
    const decodedData = jwt.verify(token, secretKey);
    return decodedData;
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};

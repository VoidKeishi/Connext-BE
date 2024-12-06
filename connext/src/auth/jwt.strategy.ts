import { UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

type Payload = {
  email: string,
  user_id: number,
  role: 'user' | 'admin',
}

export const jwtSign = (payload: Payload, secretKey: string, expiresIn: string) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn })
  return token
}

export const verifyToken = (token: string, secretKey: string) => {
  try {
    const decodedData = jwt.verify(token, secretKey)
    return decodedData
  } catch (error) {
    throw new UnauthorizedException(error)
  }
}

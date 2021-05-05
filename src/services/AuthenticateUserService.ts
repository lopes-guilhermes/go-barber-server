import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from "../models/User";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email }
    });

    if(!user)
      throw new Error('Incorrect email/password combination');

    const passwordMatched = await compare(password, user.password as string);

    if(!passwordMatched)
      throw new Error('Incorrect email/password combination');

    const token = sign({},'8538607221f2e42284acf599214cfa34', { 
      subject: user.id,
      expiresIn: '1d'
    });

    return {
      user,
      token
    }
  }
}

export default AuthenticateUserService;
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
  email: string
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) { }
  
  public async execute({ email }: IRequest): Promise<void> {
    const checkUserExists = await this.usersRepository.findByEmail(email);
    
    if(!checkUserExists)
      throw new AppError('User does not exists.');
    
    this.mailProvider.sendEmail(email, 'Pedido de recuperação de senha recebido');
  }
}

export default SendForgotPasswordEmailService;
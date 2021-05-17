import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeusersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeusersRepository);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id');
  });
  
  it('should be able to create a new user with same email from another', async () => {
    const fakeusersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeusersRepository);

    const appointmentDate = new Date();

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    })

    expect(createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError)
  });
});
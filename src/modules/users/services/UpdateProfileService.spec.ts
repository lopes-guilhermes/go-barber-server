import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FaketHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'change-email@email.com',
      name: 'change-name'
    });

    expect(updatedUser.name).toBe('change-name');
    expect(updatedUser.email).toBe('change-email@email.com');
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(updateProfile.execute({
      user_id: 'non-existing-user-id',
      name: 'John Doe',
      email: 'johndoe@email.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@email.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      email: 'johndoe@email.com',
      name: 'Test'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '121212',
      old_password: '123456'
    });

    expect(updatedUser.password).toBe('121212');
  });

  it('should not be able to the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '121212',
    })).rejects.toBeInstanceOf(AppError);    
  });

  it('should not be able to the password without wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '121212',
      old_password: '121212'
    })).rejects.toBeInstanceOf(AppError);    
  });
});
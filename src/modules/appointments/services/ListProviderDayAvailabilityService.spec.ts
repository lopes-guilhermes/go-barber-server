import AppError from '@shared/errors/AppErrors';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the day availability from providers', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2021, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2021, 4, 20, 10, 0, 0),
    });

    
    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      year: 2021,
      month: 5,
      day: 20
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8,  available: false },
        { hour: 9,  available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ])
    );
  });
});
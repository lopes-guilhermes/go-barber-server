import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppErrors';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;  
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: IAppointmentsRepository) { }
  
  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointment = await this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointment)
      throw new AppError('This appointment is already booked');

    const appointment = await this.appointmentsRepository.create({
      provider_id, 
      date: appointmentDate
    });

    return appointment;
  }  
}

export default CreateAppointmentService;
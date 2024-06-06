import { Doctor } from './doctor.model';
import { Patient } from './patient.model';

export interface Appointment {
  id?: number;
  patient: Patient;
  doctor: Doctor;
  appointmentDate: Date;
  reason: string;
}

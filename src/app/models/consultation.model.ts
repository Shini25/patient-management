import { Doctor } from './doctor.model';
import { Patient } from './patient.model';

export interface Consultation {
  id?: number;
  patient: Patient;
  doctor: Doctor;
  consultationDate: Date;
  consultationReason: string;
  diagnosis: string;
  prescribedTreatment: string;
  testResults: string;
  consultationFee?: number;
  paymentStatus: boolean;
  observations: string;
}
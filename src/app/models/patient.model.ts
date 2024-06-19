export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: string;
  email: string;
  phoneNumber: string;
  gender: string; 
  patientCategory: string; // Assuming patientCategory is a string, you can change it to an enum if needed
  consultationStatus: boolean;
  appointmentStatus: boolean;
}

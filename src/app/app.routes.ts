import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddDoctorComponent } from './add-medecin/add-doctor.component';
import { AddAppointmentComponent } from './add-rendez-vous/add-rendez-vous.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { AddConsultationComponent } from './add-consultation/add-consultation.component';
import { ListDoctorComponent } from './list-medecin/list-medecin.component';
import { ListPatientComponent } from './list-patient/list-patient.component';
import { ListAppointmentComponent } from './list-rendez-vous/list-rendez-vous.component';
import { ListConsultationComponent } from './list-consultation/list-consultation.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: '', redirectTo: 'home/list-doctor', pathMatch: 'full' },
  { path: 'create-account', component: CreateAccountComponent, title: 'Create Account' },
  { 
    path: 'home', 
    component: HomeComponent, 
    title: 'Home page',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list-doctor', pathMatch: 'full' },
      { path: 'add-patient', component: AddPatientComponent, title: 'Add Patient' },
      { path: 'add-doctor', component: AddDoctorComponent, title: 'Register a Doctor' },
      { path: 'add-consultation', component: AddConsultationComponent, title: 'Register a Consultation' },
      { path: 'add-appointment', component: AddAppointmentComponent, title: 'Register an Appointment' },
      { path: 'list-patient', component: ListPatientComponent, title: 'List of Patients' },
      { path: 'list-doctor', component: ListDoctorComponent, title: 'List of Doctors' },
      { path: 'list-consultation', component: ListConsultationComponent, title: 'List of Consultations' },
      { path: 'list-appointment', component: ListAppointmentComponent, title: 'List of Appointments' },
    ]
  },
  { path: '**', component: NotFoundComponent, title: 'Not Found' }
];

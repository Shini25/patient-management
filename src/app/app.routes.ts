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

export const routes: Routes = [

      {
    path: 'home',
    component: HomeComponent,
    title: 'Home page'
  },
  {
    path: 'add-patient',
    component: AddPatientComponent,
    title: 'AddVisitorComponent'
  },
  {
    path: 'add-doctor',
    component: AddDoctorComponent,
    title: 'register a doctor'

  },
  {
    path: 'add-consultation',
    component: AddConsultationComponent,
    title: 'Register a consultation'
  },
  {
    path: 'add-appointment',
    component: AddAppointmentComponent,
    title: 'Register an appointment'

  },
  {
    path: 'add-consultation',
    component: AddConsultationComponent,
    title: 'Register a consultation'

  },
    {
    path: 'list-patient',
    component: ListPatientComponent,
    title: 'AddVisitorComponent'
  },
  {
    path: 'list-doctor',
    component: ListDoctorComponent,
    title: 'Home page'

  },
  {
    path: 'list-consultation',
    component: ListConsultationComponent,
    title: 'List of Consultations'
  },

  {
    path: 'list-appointment',
    component: ListAppointmentComponent,
    title: 'rendes vous'

  },
  {
    path: '**',
    component: HomeComponent,
    title: 'Home page'
  },

];


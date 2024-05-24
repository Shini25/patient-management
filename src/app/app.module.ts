// Dans votre AppModule

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { routes } from './app.routes'; // Supposons que vous avez un module de routage séparé
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { AddDoctorComponent } from './add-medecin/add-doctor.component';
import { AddAppointmentComponent } from './add-rendez-vous/add-rendez-vous.component';
import { AddConsultationComponent } from './add-consultation/add-consultation.component';

import { ListDoctorComponent } from './list-medecin/list-medecin.component';
import { ListPatientComponent } from './list-patient/list-patient.component';
import { ListAppointmentComponent } from './list-rendez-vous/list-rendez-vous.component';
import { ListConsultationComponent } from './list-consultation/list-consultation.component';
import { SharedModule } from './shared/shared.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import * as AOS from 'aos';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddPatientComponent,
    AddDoctorComponent,
    AddAppointmentComponent,
    AddConsultationComponent,
    ListDoctorComponent,
    ListPatientComponent,
    ListAppointmentComponent,
    ListConsultationComponent
  ],
  
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    RouterLink,
    FontAwesomeModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    }),
    RouterModule.forRoot(routes) // Configure les routes principales
    // Autres modules nécessaires à votre application
  ],
  providers: [
    // Fournisseurs de services nécessaires à votre application, comme ToastrService
  
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
    ngOnInit() {
    AOS.init();
  }
 }

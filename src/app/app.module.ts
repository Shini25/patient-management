// Dans votre AppModule

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { CreateAccountComponent } from './create-account/create-account.component';

import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { EditPatientModalComponent } from './edit-patient-modal/edit-patient-modal.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ConfirmationDoctorDialogComponent } from './confirmation-doctor-dialog/confirmation-doctor-dialog.component';
import { DeleteDoctorConfirmationDialogComponent } from './delete-doctor-confirmation-dialog/delete-doctor-confirmation-dialog.component';
import { EditDoctorModalComponent } from './edit-doctor-modal/edit-doctor-modal.component';
import { EditAppointmentModalComponent } from './edit-appointment-modal/edit-appointment-modal.component';
import { ConfirmationAppointmentDialogComponent } from './confirmation-appointment-dialog/confirmation-appointment-dialog.component';
import { DeleteAppointmentConfirmationDialogComponent } from './delete-appointment-confirmation-dialog/delete-appointment-confirmation-dialog.component';
import { EditConsultationModalComponent } from './edit-consultation-modal/edit-consultation-modal.component';
import { ConfirmationConsultationDialogComponent } from './confirmation-consultation-dialog/confirmation-consultation-dialog.component';
import { DeleteConsultationConfirmationDialogComponent } from './delete-consultation-confirmation-dialog/delete-consultation-confirmation-dialog.component';

import { LoginComponent } from './login/login.component';



import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

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
    ListConsultationComponent,
    CreateAccountComponent,
    EditPatientModalComponent,
    ConfirmationDialogComponent,
    DeleteConfirmationDialogComponent,
    ConfirmationDoctorDialogComponent,
    DeleteDoctorConfirmationDialogComponent,
    EditDoctorModalComponent,
    EditAppointmentModalComponent,
    ConfirmationAppointmentDialogComponent,
    DeleteAppointmentConfirmationDialogComponent,
    EditConsultationModalComponent,
    ConfirmationConsultationDialogComponent,
    DeleteConsultationConfirmationDialogComponent,
    LoginComponent

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
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-left',
      preventDuplicates: true,
      closeButton: true
    }),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled', anchorScrolling: 'enabled', scrollOffset: [0, 64] })
  ],
  providers: [
    // Fournisseurs de services nécessaires à votre application, comme ToastrService
  
    provideAnimationsAsync(),
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
    ngOnInit() {
  }
 }
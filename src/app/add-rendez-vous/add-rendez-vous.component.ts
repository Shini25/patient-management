import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { PatientService } from '../services/patient.service';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; 
import { catchError, switchMap, throwError } from 'rxjs';
import 'jquery';

declare global {
  interface JQuery {
    modal(action: string): void;
  }
}

@Component({
  selector: 'app-add-rendez-vous',
  templateUrl: './add-rendez-vous.component.html',
  styleUrls: ['./add-rendez-vous.component.css']
})
export class AddAppointmentComponent implements OnInit {

  @ViewChild('newappointmentElement') newappointmentElement: ElementRef | undefined;

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  newAppointmentDetails: any;

  appointmentForm = new FormGroup({
    patient: new FormControl(null, [Validators.required]),
    doctor: new FormControl(null, [Validators.required]),
    appointmentDate: new FormControl(new Date(), [Validators.required]),
    reason: new FormControl('', [Validators.required])
  });

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
    });
  }

  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe((doctors: Doctor[]) => {
      this.doctors = doctors;
    });
  }

  dismissModal() {
    $('#successModal').modal('hide');
    this.router.navigate(['/list-appointment']);
  }

  addAppointment() {
    const patientId = this.appointmentForm.get('patient')?.value;
    const doctorId = this.appointmentForm.get('doctor')?.value;
    const appointmentDateValue = this.appointmentForm.get('appointmentDate')?.value;
    const reasonValue = this.appointmentForm.get('reason')?.value;
  
    if (patientId && doctorId && appointmentDateValue && reasonValue) {
      this.patientService.getPatientById(patientId).pipe(
        switchMap((patient: Patient) => {
          if (patient) {
            return this.doctorService.getDoctorById(doctorId).pipe(
              switchMap((doctor: Doctor) => {
                if (doctor) {
                  const newAppointment = {
                    patient: patient,
                    doctor: doctor,
                    appointmentDate: appointmentDateValue,
                    reason: reasonValue
                  };
                  // Enregistrer le nouvel rendez-vous
                  return this.appointmentService.saveAppointment(newAppointment);
                } else {
                  this.toastr.error('Doctor not found.');
                  return throwError(() => new Error('Doctor not found'));
                }
              }),
              catchError((error) => {
                this.toastr.error('Doctor not found.');
                return throwError(() => new Error('Doctor not found'));
              })
            );
          } else {
            this.toastr.error();
            return throwError(() => new Error);
          }
        }),
        catchError((error) => {
          this.toastr.error('Patient not found.');
          return throwError(() => new Error('Patient not found'));
        })
      ).subscribe({
        next: (response: any) => {
          this.newAppointmentDetails = response;
          $('#successModal').modal('show');
          this.toastr.success('Appointment successfully added.');
        },
        error: (error) => {
          this.toastr.error('An error occurred: ' + error.message);
        }
      });
    } else {
      this.toastr.error('Please fill all required fields.');
    }
  }
}


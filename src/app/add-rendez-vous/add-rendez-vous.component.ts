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
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogAppointmentComponent } from './success-dialog-appointment/success-dialog-appointment.component';
import { ThemePalette } from '@angular/material/core';

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

  minDate: Date = new Date(); // Today's date

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  newAppointmentDetails: any;

  appointmentForm = new FormGroup({
    patient: new FormControl(null, [Validators.required]),
    doctor: new FormControl(null, [Validators.required]),
    appointmentDate: new FormControl(this.minDate, [Validators.required]), // Use today's date as initial value
    reason: new FormControl('', [Validators.required])
  });

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.type();

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


  addAppointment() {
    const patientId = this.appointmentForm.get('patient')?.value;
    const doctorId = this.appointmentForm.get('doctor')?.value;
    const appointmentDateValue = this.appointmentForm.get('appointmentDate')?.value;
    const reasonValue = this.appointmentForm.get('reason')?.value;

    if (patientId && doctorId && appointmentDateValue && reasonValue) {
        setTimeout(() => {
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
                                    return this.appointmentService.saveAppointment(newAppointment).pipe(
                                        switchMap((appointmentResponse) => {
                                            patient.appointmentStatus = true; // Update appointmentStatus to true
                                            doctor.appointmentState = true; // Update doctor's appointmentState to true
                                            return this.doctorService.updateDoctor(doctorId, doctor).pipe(
                                                switchMap(() => {
                                                    if (patient.id !== undefined) {
                                                        return this.patientService.updatePatient(patient.id, patient);
                                                    } else {
                                                        this.toastr.error('Patient ID is undefined.');
                                                        return throwError(() => new Error('Patient ID is undefined'));
                                                    }
                                                })
                                            );
                                        })
                                    );
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
                        this.toastr.error('Patient not found.');
                        return throwError(() => new Error('Patient not found'));
                    }
                }),
                catchError((error) => {
                    this.toastr.error('Patient not found.');
                    return throwError(() => new Error('Patient not found'));
                })
            ).subscribe({
                next: (response: any) => {
                    this.newAppointmentDetails = response;
                    const dialogRef = this.dialog.open(SuccessDialogAppointmentComponent);
                    dialogRef.afterClosed().subscribe(() => {
                        this.appointmentForm.reset();
                    });
                    this.toastr.success('Appointment successfully added.');
                },
                error: (error) => {
                    this.toastr.error('An error occurred: ' + error.message);
                }
            });
        }, 1000); // Delay of 1000 milliseconds (1 second)
    } else {
        this.toastr.error('Please fill all required fields.');
    }
  }
  phrases: string[] = [
    "Welcome to patient registration!",
    "All patients",
    "must come here",
    " before ",
    "visiting the doctor's office."
    
  ];
  displayedText: string = '';
  currentPhraseIndex: number = 0;
  currentCharIndex: number = 0;
  isDeleting: boolean = false;
  typingSpeed: number = 100;
  deletingSpeed: number = 50;
  pauseBeforeDelete: number = 2000;
  pauseBetweenPhrases: number = 1000;



  type() {
    const currentPhrase = this.phrases[this.currentPhraseIndex];

    if (!this.isDeleting && this.currentCharIndex < currentPhrase.length) {
      this.displayedText = currentPhrase.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
      setTimeout(() => this.type(), this.typingSpeed);
    } else if (this.isDeleting && this.currentCharIndex > 0) {
      this.displayedText = currentPhrase.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
      setTimeout(() => this.type(), this.deletingSpeed);
    } else if (!this.isDeleting && this.currentCharIndex === currentPhrase.length) {
      this.isDeleting = true;
      setTimeout(() => this.type(), this.pauseBeforeDelete);
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
      setTimeout(() => this.type(), this.pauseBetweenPhrases);
    }
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConsultationService } from '../services/consultation.service';
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
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  styleUrls: ['./add-consultation.component.css']
})
export class AddConsultationComponent implements OnInit {

  @ViewChild('newconsultationElement') newconsultationElement: ElementRef | undefined;

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  newConsultationDetails: any;

  consultationForm = new FormGroup({
    patient: new FormControl(null, [Validators.required]),
    doctor: new FormControl(null, [Validators.required]),
    consultationDate: new FormControl(new Date(), [Validators.required]),
    consultationReason: new FormControl('', [Validators.required]),
    diagnosis: new FormControl('', [Validators.required]),
    prescribedTreatment: new FormControl('', [Validators.required]),
    testResults: new FormControl('', [Validators.required]),
    consultationFee: new FormControl('', [Validators.required]),
    observations: new FormControl('', [Validators.required]),
    paymentStatus: new FormControl('', [Validators.required])
  });

  constructor(
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private router: Router,
    private toastr: ToastrService
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

  dismissModal() {
    $('#successModal').modal('hide');
    this.router.navigate(['/list-consultation']);
  }

  addConsultation() {
    const patientId = this.consultationForm.get('patient')?.value;
    const doctorId = this.consultationForm.get('doctor')?.value;
    const consultationDateValue = this.consultationForm.get('consultationDate')?.value;
    const consultationReasonValue = this.consultationForm.get('consultationReason')?.value;
    const diagnosisValue = this.consultationForm.get('diagnosis')?.value;
    const prescribedTreatmentValue = this.consultationForm.get('prescribedTreatment')?.value;
    const testResultsValue = this.consultationForm.get('testResults')?.value;
    const consultationFeeValue = this.consultationForm.get('consultationFee')?.value;
    const observationsValue = this.consultationForm.get('observations')?.value;
    const paymentStatusValue = this.consultationForm.get('paymentStatus')?.value;

    if (patientId && doctorId && consultationDateValue && consultationReasonValue && diagnosisValue && prescribedTreatmentValue && testResultsValue && consultationFeeValue && observationsValue && paymentStatusValue) {
      this.patientService.getPatientById(patientId).pipe(
        switchMap((patient: Patient) => {
          if (patient) {
            return this.doctorService.getDoctorById(doctorId).pipe(
              switchMap((doctor: Doctor) => {
                if (doctor) {
                  const newConsultation = {
                    patient: patient,
                    doctor: doctor,
                    consultationDate: consultationDateValue,
                    consultationReason: consultationReasonValue,
                    diagnosis: diagnosisValue,
                    prescribedTreatment: prescribedTreatmentValue,
                    testResults: testResultsValue,
                    consultationFee: parseFloat(consultationFeeValue),
                    observations: observationsValue,
                    paymentStatus: paymentStatusValue
                  };
                  return this.consultationService.saveConsultation(newConsultation);
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
          this.newConsultationDetails = response;
          $('#successModal').modal('show');
          this.toastr.success('Consultation successfully added.');
        },
        error: (error) => {
          this.toastr.error('An error occurred: ' + error.message);
        }
      });
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

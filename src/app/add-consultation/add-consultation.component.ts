import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConsultationService } from '../services/consultation.service'; // Remplacer le service d'appointement par le service de consultation
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
  selector: 'app-add-consultation', // Modifier le nom du composant
  templateUrl: './add-consultation.component.html', // Modifier le chemin du template
  styleUrls: ['./add-consultation.component.css'] // Modifier le chemin des styles
})
export class AddConsultationComponent implements OnInit { // Modifier le nom de la classe

  @ViewChild('newconsultationElement') newconsultationElement: ElementRef | undefined; // Modifier la référence de l'élément

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  newConsultationDetails: any; // Modifier le nom de la variable

  consultationForm = new FormGroup({ // Modifier le nom du formulaire et les champs
    patient: new FormControl(null, [Validators.required]),
    doctor: new FormControl(null, [Validators.required]),
    consultationDate: new FormControl(new Date(), [Validators.required]),
    consultationReason: new FormControl('', [Validators.required]),
    diagnosis: new FormControl('', [Validators.required]),
    prescribedTreatment: new FormControl('', [Validators.required]),
    testResults: new FormControl('', [Validators.required]),
    consultationFee: new FormControl(null, [Validators.required]),
    paymentStatus: new FormControl(false, [Validators.required]),
    observations: new FormControl('', [Validators.required])
  });

  constructor(
    private consultationService: ConsultationService, // Modifier le service d'appointement par le service de consultation
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

  setPaymentStatus(value: boolean) {
    this.consultationForm.patchValue({ paymentStatus: value });
}


  dismissModal() {
    $('#successModal').modal('hide');
    this.router.navigate(['/list-consultation']); // Modifier le chemin de navigation
  }

  addConsultation() { // Modifier le nom de la méthode
    const patientId = this.consultationForm.get('patient')?.value;
    const doctorId = this.consultationForm.get('doctor')?.value;
    const consultationDateValue = this.consultationForm.get('consultationDate')?.value;
    const consultationReasonValue = this.consultationForm.get('consultationReason')?.value; // Modifier le nom de la variable
    const diagnosisValue = this.consultationForm.get('diagnosis')?.value; // Modifier le nom de la variable
    const prescribedTreatmentValue = this.consultationForm.get('prescribedTreatment')?.value; // Modifier le nom de la variable
    const testResultsValue = this.consultationForm.get('testResults')?.value; // Modifier le nom de la variable
    const consultationFeeValue = this.consultationForm.get('consultationFee')?.value; // Modifier le nom de la variable
    const paymentStatusValue = this.consultationForm.get('paymentStatus')?.value; // Modifier le nom de la variable
    const observationsValue = this.consultationForm.get('observations')?.value; // Modifier le nom de la variable
  
    if (patientId && doctorId && consultationDateValue && consultationReasonValue && diagnosisValue && prescribedTreatmentValue && testResultsValue && consultationFeeValue && paymentStatusValue && observationsValue) {
      this.patientService.getPatientById(patientId).pipe(
        switchMap((patient: Patient) => {
          if (patient) {
            return this.doctorService.getDoctorById(doctorId).pipe(
              switchMap((doctor: Doctor) => {
                if (doctor) {
                  const newConsultation = { // Modifier le nom de la variable
                    patient: patient,
                    doctor: doctor,
                    consultationDate: consultationDateValue,
                    consultationReason: consultationReasonValue, // Modifier le nom de la variable
                    diagnosis: diagnosisValue, // Modifier le nom de la variable
                    prescribedTreatment: prescribedTreatmentValue, // Modifier le nom de la variable
                    testResults: testResultsValue, // Modifier le nom de la variable
                    consultationFee: consultationFeeValue, // Modifier le nom de la variable
                    paymentStatus: paymentStatusValue, // Modifier le nom de la variable
                    observations: observationsValue // Modifier le nom de la variable
                  };
                  // Enregistrer la nouvelle consultation
                  return this.consultationService.addConsultation(newConsultation); // Modifier la méthode d'enregistrement
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
          this.newConsultationDetails = response; // Modifier le nom de la variable
          $('#successModal').modal('show');
          this.toastr.success('Consultation successfully added.'); // Modifier le message de succès
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

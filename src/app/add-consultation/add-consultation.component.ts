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
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogConsultationComponent } from './success-dialog-consultation/success-dialog-consultation.component';
import 'jquery';
import jsPDF from 'jspdf';

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


  showAdditionalFields = false;

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  newConsultationDetails: any;

  todayDate: string = new Date().toISOString().split('T')[0];

  consultationForm = new FormGroup({
    patient: new FormControl(null, [Validators.required]),
    doctor: new FormControl(null, [Validators.required]),
    consultationDate: new FormControl({ value: this.todayDate, disabled: true }, [Validators.required]),
    consultationReason: new FormControl('', [Validators.required]),
    diagnosis: new FormControl('', [Validators.required]),
    prescribedTreatment: new FormControl('', [Validators.required]),
    testResults: new FormControl('', [Validators.required]),
    consultationFee: new FormControl('', [Validators.required]),
    observations: new FormControl('', [Validators.required]),
    paymentStatus: new FormControl(true, [Validators.required])
  });

  currentSection: number = 1;

  consultationReasons: string[] = ['Routine Checkup', 'Follow-up Visit', 'Symptom Evaluation', 'dizziness','fever and cough', 'Emergency Visit', 'Referral', 'Hypertension Symptoms', 'Urgent Care'];
  testResultsOptions: string[] = ['Normal', 'Abnormal', 'Critical', 'ECG', 'Blood Pressure Control'];
  diagnoses: string[] = ['Hypertension', 'Diabetes', 'Chronic Kidney Disease', 'Heart Disease', 'Asthma', 'COVID-19', 'Parkinsons', 'Cancer', 'Blood Pressure', 'Tobacco', 'Alcohol', 'Drug', 'Pregnancy', 'Epilepsy', 'Parkinsons', 'Cancer', 'Blood Pressure', 'Tobacco', 'Alcohol', 'Drug', 'Pregnancy', 'Epilepsy'];
  prescribedTreatments: string[] = ['Anti-hypertensive medication', 'Anti-diabetic medication', 'Anti-chronic kidney disease medication', 'Anti-heart disease medication', 'Anti-asthma medication', 'Anti-COVID-19 medication', 'Anti-parkinsons medication', 'Anti-cancer medication', 'Anti-blood pressure medication', 'Anti-tobacco medication', 'Anti-alcohol medication', 'Anti-drug medication', 'Anti-pregnancy medication', 'Anti-epilepsy medication', 'Anti-parkinsons medication', 'Anti-cancer medication', 'Anti-blood pressure medication', 'Anti-tobacco medication', 'Anti-alcohol medication', 'Anti-drug medication', 'Anti-pregnancy medication', 'Anti-epilepsy medication'];
  consultationFees: number[] = [5000, 10000, 20000];  // Les frais de consultation
  observationOptions: string[] = [
    '*Patient stable with notable improvement.',
    '*No significant change in symptoms.',
    '*Condition deteriorated; immediate attention required.',
    '*Positive reaction to prescribed treatment.',
    '*Symptoms of recurrence observed.'
  ];

  constructor(
    private consultationService: ConsultationService,
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
        switchMap((patient: Patient) => this.doctorService.getDoctorById(doctorId).pipe(
          switchMap((doctor: Doctor) => {
            const newConsultation = {
              patient: patient,
              doctor: doctor,
              consultationDate: new Date(consultationDateValue), // Convert string to Date
              consultationReason: consultationReasonValue,
              diagnosis: diagnosisValue,
              prescribedTreatment: prescribedTreatmentValue,
              testResults: testResultsValue,
              consultationFee: parseFloat(consultationFeeValue),
              observations: observationsValue,
              paymentStatus: paymentStatusValue
            };
            return this.consultationService.saveConsultation(newConsultation);
          })
        ))
      ).subscribe({
        next: (response: any) => {
          this.newConsultationDetails = response;
          this.generatePDF(this.newConsultationDetails);
          const dialogRef = this.dialog.open(SuccessDialogConsultationComponent);
          dialogRef.afterClosed().subscribe(() => {
            this.resetForm();
          });
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

  generatePDF(consultationDetails: any) {
    const doc = new jsPDF();

    // Définir une police
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);

    // Ajouter un titre
    doc.text('Détails de la Consultation', 1, 10);

    // Changer la police pour le contenu
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Vérifiez si les objets patient et doctor sont définis
    if (!consultationDetails.patient || !consultationDetails.doctor) {
      console.error('Patient or Doctor details are undefined.');
      this.toastr.error('Failed to generate PDF: Missing patient or doctor details.');
      return;
    }

    // Utilisez firstName et lastName au lieu de name
    const patientName = `${consultationDetails.patient.firstName} ${consultationDetails.patient.lastName}`;
    const doctorName = `${consultationDetails.doctor.firstName} ${consultationDetails.doctor.lastName}`;

    // Définir la couleur du texte
    doc.setTextColor(100); // Gris
    doc.text(`Patient: ${patientName}`, 10, 20);

    // Utiliser une autre couleur pour une autre section
    doc.setTextColor(150);
    doc.text(`Docteur: ${doctorName}`, 10, 30);
    doc.text(`Date: ${consultationDetails.consultationDate}`, 10, 40); // Aligner le texte
    doc.text(`Raison: ${consultationDetails.consultationReason}`, 10, 50);
    doc.text(`Diagnostic: ${consultationDetails.diagnosis}`, 10, 60);
    doc.text(`Traitement: ${consultationDetails.prescribedTreatment}`, 10, 70);
    doc.text(`Résultats des tests: ${consultationDetails.testResults}`, 10, 80);
    doc.text(`Observations: ${consultationDetails.observations}`, 10, 90);

    doc.save('consultation-details.pdf');
  }

  nextSection() {
    if (this.currentSection < 2) {
      this.currentSection++;
    }
    
  }
  

  previousSection() {
    if (this.currentSection > 1) {
      this.currentSection--;
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

  resetForm() {
    const currentDate = this.todayDate;
    this.consultationForm.reset();
    this.consultationForm.patchValue({
      consultationDate: currentDate
    });
    this.consultationForm.get('consultationDate')?.disable();
    this.currentSection = 1;
  }


  toggleFields(): void {
    this.showAdditionalFields = !this.showAdditionalFields;
  }
  
}


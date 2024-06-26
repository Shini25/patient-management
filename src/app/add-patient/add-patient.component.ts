import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; 
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogPatientComponent } from './success-dialog-patient/success-dialog-patient.component';

import 'jquery';

declare global {
  interface JQuery {
    modal(action: string): void;
  }
}

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
})
export class AddPatientComponent implements OnInit {

  @ViewChild('newPatientElement') newPatientElement: ElementRef | undefined;

  patientForm = new FormGroup({
    firstName:  new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]), // Removed default date formatting
    gender: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    patientCategory: new FormControl('', [Validators.required]),
    consultationStatus: new FormControl(false, [Validators.required]),
    appointmentStatus: new FormControl(false, [Validators.required])
  });

  newPatientDetails: any;
  maxDate: Date;
  showAdditionalFields = false;
  isLoading: boolean = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.maxDate = new Date();
  }

  dismissModal() {
    $('#successModal').modal('hide');
    this.router.navigate(['/list-patient']);
  }

  addPatient() {
    if (this.patientForm.valid) {
      this.isLoading = true;
      const firstNameValue = this.patientForm.get('firstName')?.value;
      const lastNameValue = this.patientForm.get('lastName')?.value;
      const dateOfBirthValue = this.patientForm.get('dateOfBirth')?.value;
      const genderValue = this.patientForm.get('gender')?.value;
      const addressValue = this.patientForm.get('address')?.value;
      const phoneNumberValue = this.patientForm.get('phoneNumber')?.value;
      const emailValue = this.patientForm.get('email')?.value;
      const patientCategoryValue = this.patientForm.get('patientCategory')?.value;
      const consultationStatusValue = this.patientForm.get('consultationStatus')?.value;
      const appointmentStatusValue = this.patientForm.get('appointmentStatus')?.value;

      if (
        firstNameValue !== null &&
        firstNameValue !== undefined &&
        lastNameValue !== null &&
        lastNameValue !== undefined &&
        dateOfBirthValue !== null &&
        dateOfBirthValue !== undefined &&
        genderValue !== null && 
        genderValue !== undefined &&
        addressValue !== null &&
        addressValue !== undefined &&
        phoneNumberValue !== null &&
        phoneNumberValue !== undefined &&
        emailValue != null &&
        emailValue != undefined &&
        patientCategoryValue !== null &&
        patientCategoryValue !== undefined &&
        consultationStatusValue !== null &&
        consultationStatusValue !== undefined &&
        appointmentStatusValue !== null &&
        appointmentStatusValue !== undefined
      ) {
        const newPatient = {
          firstName: firstNameValue,
          lastName: lastNameValue,
          dateOfBirth: new Date(dateOfBirthValue), // Convert string to Date
          gender: genderValue,
          address: addressValue,
          phoneNumber: phoneNumberValue,
          email: emailValue,
          patientCategory: patientCategoryValue,
          consultationStatus: consultationStatusValue,
          appointmentStatus: appointmentStatusValue
        };

        // Ajouter un délai avant de procéder à l'ajout des données
        setTimeout(() => {
          this.patientService.savePatient(newPatient).subscribe((response: any) => {
            this.newPatientDetails = response;

            // Afficher la notification de succès
            this.toastr.success('Patient enregistré avec succès ! En attente de la disponibilité du bureau du docteur.');

            // Ouvrir le dialogue de succès
            const dialogRef = this.dialog.open(SuccessDialogPatientComponent);

            // Réinitialiser le formulaire après la fermeture du dialogue
            dialogRef.afterClosed().subscribe(() => {
              this.resetForm();
            });

            this.isLoading = false;
          }, (error) => {
            this.toastr.error('Erreur lors de l\'enregistrement du patient.');
            this.isLoading = false;
          });
        }, 2000); // Délai de 1000 millisecondes (1 seconde)
      }
    } else {
      this.toastr.error('Veuillez remplir tous les champs requis.');
    }
  }

  resetForm() {
    this.patientForm.reset();
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


  ngOnInit(): void {
    this.type();
  }

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

  toggleFields(): void {
    this.showAdditionalFields = !this.showAdditionalFields;
  }
}

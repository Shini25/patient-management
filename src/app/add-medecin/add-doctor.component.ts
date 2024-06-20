import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DoctorService } from '../services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; 
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogDoctorComponent } from './success-dialog-doctor/success-dialog-doctor.component';
import 'jquery';

declare global {
  interface JQuery {
    modal(action: string): void;
  }
}

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css'
})
export class AddDoctorComponent implements OnInit {
  

  @ViewChild('newDoctorElement') newDoctorElement: ElementRef | undefined;

  doctorForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    specialty: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contact: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl(new Date(), [Validators.required]),
    appointmentState: new FormControl(false, [Validators.required])
    
  });

  // Variable pour stocker les détails du médecin ajouté
  newDoctorDetails: any;

  maxDate: Date;

  specialties: string[] = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Oncology'];

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.maxDate = new Date();
  }

  // Méthode pour fermer le modal
  dismissModal() {
    // Fermer le modal en utilisant son ID
    $('#successModal').modal('hide');
    // Naviguer vers la vue de liste
    this.router.navigate(['/list-doctor']);
  }

addDoctor() {
  if (this.doctorForm.valid) {
    const firstNameValue = this.doctorForm.get('firstName')?.value;
    const lastNameValue = this.doctorForm.get('lastName')?.value;
    const specialtyValue = this.doctorForm.get('specialty')?.value;
    const emailValue = this.doctorForm.get('email')?.value;
    const contactValue = this.doctorForm.get('contact')?.value;
    const addressValue = this.doctorForm.get('address')?.value;
    const dateOfBirthValue = this.doctorForm.get('dateOfBirth')?.value;
    const appointmentStateValue = this.doctorForm.get('appointmentState')?.value;




    if (
      firstNameValue !== null && firstNameValue !== undefined &&
      lastNameValue !== null && lastNameValue !== undefined &&
      specialtyValue !== null && specialtyValue !== undefined &&
      emailValue !== null && emailValue !== undefined &&
      contactValue !== null && contactValue !== undefined &&
      addressValue !== null && addressValue !== undefined && 
      dateOfBirthValue !== null && dateOfBirthValue !== undefined &&
      appointmentStateValue !== null && appointmentStateValue !== undefined

    ) {
      const newDoctor = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        specialty: specialtyValue,
        email: emailValue,
        contact: contactValue,
        address: addressValue,
        dateOfBirth: dateOfBirthValue,
        appointmentState: appointmentStateValue
      };

      this.doctorService.saveDoctor(newDoctor).subscribe((response: any) => {
        // Stocker les détails du médecin ajouté
        this.newDoctorDetails = response;

        // Afficher la boîte de message de succès (modal)
        $('#successModal').modal('show');
        this.toastr.success('Ajout du médecin effectué avec succès !');
        const dialogRef = this.dialog.open(SuccessDialogDoctorComponent);
        dialogRef.afterClosed().subscribe(() => {
          this.doctorForm.reset();
        });
      });
    }
  }
}
  resetForm() {
    throw new Error('Method not implemented.');
  }


phrases: string[] = [
  "Welcome to doctor registration!",
  
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
}

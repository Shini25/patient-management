import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; 
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
export class AddPatientComponent {

  @ViewChild('newPatientElement') newPatientElement: ElementRef | undefined;

  patientForm = new FormGroup({
    firstName:  new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]), // Removed default date formatting
    gender: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required])
  });

  newPatientDetails: any;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  dismissModal() {
    $('#successModal').modal('hide');
    this.router.navigate(['/list-patient']);
  }

  addPatient() {
    if (this.patientForm.valid) {
      const firstNameValue = this.patientForm.get('firstName')?.value;
      const lastNameValue = this.patientForm.get('lastName')?.value;
      const dateOfBirthValue = this.patientForm.get('dateOfBirth')?.value;
      const genderValue = this.patientForm.get('gender')?.value;
      const addressValue = this.patientForm.get('address')?.value;
      const phoneNumberValue = this.patientForm.get('phoneNumber')?.value;
      const emailValue = this.patientForm.get('email')?.value;

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
        emailValue != undefined
      ) {
        const newPatient = {
          firstName: firstNameValue,
          lastName: lastNameValue,
          dateOfBirth: new Date(dateOfBirthValue), // Convert string to Date
          gender: genderValue,
          address: addressValue,
          phoneNumber: phoneNumberValue,
          email: emailValue
        };

        this.patientService.savePatient(newPatient).subscribe((response: any) => {
          this.newPatientDetails = response;
          $('#successModal').modal('show');
          this.toastr.success('Patient added successfully!');
        });
      }
    }
  }
}


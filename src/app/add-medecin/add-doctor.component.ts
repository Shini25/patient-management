import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DoctorService } from '../services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; 
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
export class AddDoctorComponent {
  

  @ViewChild('newDoctorElement') newDoctorElement: ElementRef | undefined;

  doctorForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    specialty: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl(new Date, [Validators.required])
    
  });

  // Variable pour stocker les détails du médecin ajouté
  newDoctorDetails: any;

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private toastr: ToastrService
  ) {}

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




    if (
      firstNameValue !== null && firstNameValue !== undefined &&
      lastNameValue !== null && lastNameValue !== undefined &&
      specialtyValue !== null && specialtyValue !== undefined &&
      emailValue !== null && emailValue !== undefined &&
      contactValue !== null && contactValue !== undefined &&
      addressValue !== null && addressValue !== undefined && 
      dateOfBirthValue !== null && dateOfBirthValue !== undefined

    ) {
      const newDoctor = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        specialty: specialtyValue,
        email: emailValue,
        contact: contactValue,
        address: addressValue,
        dateOfBirth: dateOfBirthValue
      };

      this.doctorService.saveDoctor(newDoctor).subscribe((response: any) => {
        // Stocker les détails du médecin ajouté
        this.newDoctorDetails = response;

        // Afficher la boîte de message de succès (modal)
        $('#successModal').modal('show');
        this.toastr.success('Ajout du médecin effectué avec succès !');
      });
    }
  }
}


}


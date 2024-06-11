import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EditPatientModalComponent } from '../edit-patient-modal/edit-patient-modal.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-patient',
  templateUrl: './list-patient.component.html',
  styleUrl: './list-patient.component.css'
})
export class ListPatientComponent implements OnInit {

  patients: Patient[] = [];
  selectedPatient: Patient | null = null;
  blurredPatientId: number | null = null;
  loading: boolean = false; // État de chargement initial

  constructor(private patientService: PatientService, private toastr: ToastrService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe(
      patients => {
        this.patients = patients; // Mettez à jour this.patients avec les données récupérées
      },
      error => {
        console.error('Error fetching patients:', error);
        // Gérez l'erreur ici, affichez un message à l'utilisateur, etc.
      }
    );
  }

  calculateAge(dateOfBirth: Date): { age: number, isLessThanOneYear: boolean, isLessThanOneMonth: boolean } {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let ageInYears = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth() + (12 * (today.getFullYear() - birthDate.getFullYear()));
    const dayDifference = today.getDate() - birthDate.getDate();

    if (dayDifference < 0) {
      months--;
    }

    if (months < 0) {
      months += 12;
      ageInYears--;
    }

    let days = 0;
    if (months === 0 && ageInYears === 0) {
      days = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 3600 * 24));
    }

    return {
      age: ageInYears < 1 ? (months < 1 ? days : months) : ageInYears,
      isLessThanOneYear: ageInYears < 1,
      isLessThanOneMonth: months === 0 && ageInYears === 0
    };
  }

  addBlur(patientId: number | undefined) {
    if (patientId !== undefined) {
      this.blurredPatientId = patientId;
    }
  }

  removeBlur() {
    this.blurredPatientId = null;
  }

  formatFirstName(name: string): string {
    return name.length > 17 ? name.slice(0, 17) + '...' : name;
  }

  formatLastName(name: string): string {
    return name.length > 25 ? name.slice(0, 25) + '...' : name;
  }

  formatMail(mail: string): string {
    return mail.length > 25 ? mail.slice(0, 25) + '...' : mail;
  }

  editPatient(patient: Patient): void {
    const dialogRef = this.dialog.open(EditPatientModalComponent, {
      width: '400px',
      data: { ...patient }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Logique de mise à jour du patient
        this.updatePatient(result, patient);
      }
    });
  }

  updatePatient(updatedPatient: Patient, previousPatient: Patient): void {
    if (updatedPatient && updatedPatient.id !== undefined) {
      this.patientService.updatePatient(updatedPatient.id, updatedPatient).subscribe(
        () => {
          // Mettre à jour la liste des patients après la modification
          this.loadPatients();

          // Ouvrir le dialogue de confirmation
          this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: {
              previous: previousPatient,
              updated: updatedPatient
            }
          });
        },
        error => {
          console.error('Error updating patient:', error);
        }
      );
    } else {
      console.error('Selected patient or patient ID is undefined.');
    }
  }

  deletePatient(id: number | undefined, patient: Patient | undefined): void {
    if (!patient) {
      console.error('Patient is undefined.');
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { firstName: patient.firstName, lastName: patient.lastName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Afficher l'animation de chargement
        this.loading = true;

        if (id !== undefined) {
          this.patientService.deletePatient(id).subscribe(
            () => {
              // Rafraîchir la liste des patients après la suppression
              this.loadPatients();
              this.toastr.success('Suppression du patient effectuée avec succès !');
            },
            (error: HttpErrorResponse) => {
              console.error('Error deleting patient:', error);
              if (error.status === 500) {
                this.toastr.error('Le patient a des rendez-vous ou des consultations associés. Veuillez les supprimer avant de supprimer le patient.');
              } else {
                this.toastr.error('Une erreur est survenue lors de la suppression du patient.');
              }
            }
          );
        } else {
          console.error('ID du patient non défini.');
        }

        // Cacher l'animation de chargement une fois terminée (après 1 seconde)
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }
}

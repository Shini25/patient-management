import { Component, OnInit } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { DoctorService } from '../services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDoctorDialogComponent } from '../confirmation-doctor-dialog/confirmation-doctor-dialog.component';
import { DeleteDoctorConfirmationDialogComponent } from '../delete-doctor-confirmation-dialog/delete-doctor-confirmation-dialog.component';
import { EditDoctorModalComponent } from '../edit-doctor-modal/edit-doctor-modal.component';

@Component({
  selector: 'app-list-medecin',
  templateUrl: './list-medecin.component.html',
  styleUrls: ['./list-medecin.component.css']
})
export class ListDoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  blurredDoctorId: number | null = null;
  loading: boolean = false;

  constructor(private doctorService: DoctorService, private toastr: ToastrService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe(
      doctors => {
        this.doctors = doctors;
      },
      error => {
        console.error('Error fetching doctors:', error);
      }
    );
  }

  calculateAge(dateOfBirth: Date): { age: number, isLessThanOneYear: boolean, isLessThanOneMonth: boolean} {
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
  

  editDoctor(doctor: Doctor): void {
    const dialogRef = this.dialog.open(EditDoctorModalComponent, {
      width: '400px',
      data: { ...doctor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateDoctor(result, doctor);
      }
    });
  }

  updateDoctor(updatedDoctor: Doctor, previousDoctor: Doctor): void {
    if (updatedDoctor && updatedDoctor.id !== undefined) {
      this.doctorService.updateDoctor(updatedDoctor.id, updatedDoctor).subscribe(
        () => {
          this.loadDoctors();
          this.dialog.open(ConfirmationDoctorDialogComponent, {
            width: '400px',
            data: {
              previous: previousDoctor,
              updated: updatedDoctor
            }
          });
        },
        error => {
          console.error('Error updating doctor:', error);
          this.toastr.error('Failed to update doctor!');
        }
      );
    } else {
      console.error('Selected doctor or doctor ID is undefined.');
    }
  }

  deleteDoctor(id: number | undefined, doctor: Doctor | undefined): void {
    if (!doctor) {
      console.error('Doctor is undefined.');
      return;
    }

    const dialogRef = this.dialog.open(DeleteDoctorConfirmationDialogComponent, {
      width: '400px',
      data: { firstName: doctor.firstName, lastName: doctor.lastName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;

        if (id !== undefined) {
          this.doctorService.deleteDoctor(id).subscribe(
            () => {
              this.loadDoctors();
              this.toastr.success('Suppression du médecin effectuée avec succès !');
            },
            (error: HttpErrorResponse) => {
              console.error('Error deleting doctor:', error);
              if (error.status === 500) {
                this.toastr.error('Le médecin a des rendez-vous ou des consultations associés. Veuillez les supprimer avant de supprimer le médecin.');
              } else {
                this.toastr.error('Une erreur est survenue lors de la suppression du médecin.');
              }
            }
          );
        } else {
          console.error('ID du médecin non défini.');
        }

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }

  addBlur(doctorId: number | undefined) {
    if (doctorId !== undefined) {
      this.blurredDoctorId = doctorId;
    }
  }

  removeBlur() {
    this.blurredDoctorId = null;
  }
}

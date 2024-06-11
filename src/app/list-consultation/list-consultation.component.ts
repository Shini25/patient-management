import { Component, OnInit } from '@angular/core';
import { Consultation } from '../models/consultation.model';
import { ConsultationService } from '../services/consultation.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationConsultationDialogComponent } from '../confirmation-consultation-dialog/confirmation-consultation-dialog.component';
import { DeleteConsultationConfirmationDialogComponent } from '../delete-consultation-confirmation-dialog/delete-consultation-confirmation-dialog.component';
import { EditConsultationModalComponent } from '../edit-consultation-modal/edit-consultation-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-consultation',
  templateUrl: './list-consultation.component.html',
  styleUrls: ['./list-consultation.component.css']
})
export class ListConsultationComponent implements OnInit {

  consultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  blurredPatientId: number | null = null;
  loading: boolean = false;

  constructor(private consultationService: ConsultationService, private toastr: ToastrService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadConsultations();
  }

  addBlur(patientId: number | undefined) {
    if (patientId !== undefined) {
      this.blurredPatientId = patientId;
    }
  }


  removeBlur() {
    this.blurredPatientId = null;
  }
  loadConsultations() {
    this.consultationService.getAllConsultations().subscribe(
      consultations => {
        this.consultations = consultations;
      },
      error => {
        console.error('Error fetching consultations:', error);
        this.toastr.error('Failed to load consultations.');
      }
    );
  }

  editConsultation(consultation: Consultation): void {
    const dialogRef = this.dialog.open(EditConsultationModalComponent, {
      width: '400px',
      data: { ...consultation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateConsultation(result, consultation);
      }
    });
  }

  updateConsultation(updatedConsultation: Consultation, previousConsultation: Consultation): void {
    if (updatedConsultation && updatedConsultation.id !== undefined) {
      this.consultationService.updateConsultation(updatedConsultation.id, updatedConsultation).subscribe(
        () => {
          this.loadConsultations();
          this.dialog.open(ConfirmationConsultationDialogComponent, {
            width: '400px',
            data: {
              previous: previousConsultation,
              updated: updatedConsultation
            }
          });
        },
        error => {
          console.error('Error updating consultation:', error);
        }
      );
    } else {
      console.error('Selected consultation or consultation ID is undefined.');
    }
  }

  deleteConsultation(id: number | undefined, consultation: Consultation | undefined): void {
    if (!consultation) {
      console.error('Consultation is undefined.');
      return;
    }

    const dialogRef = this.dialog.open(DeleteConsultationConfirmationDialogComponent, {
      width: '400px',
      data: { diagnosis: consultation.diagnosis, consultationDate: consultation.consultationDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;

        if (id !== undefined) {
          this.consultationService.deleteConsultation(id).subscribe(
            () => {
              this.loadConsultations();
              this.toastr.success('Suppression de la consultation effectuée avec succès !');
            },
            (error: HttpErrorResponse) => {
              console.error('Error deleting consultation:', error);
              if (error.status === 500) {
                this.toastr.error('La consultation a des rendez-vous associés. Veuillez les supprimer avant de supprimer la consultation.');
              } else {
                this.toastr.error('Une erreur est survenue lors de la suppression de la consultation.');
              }
            }
          );
        } else {
          console.error('ID de la consultation non défini.');
        }

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }
}

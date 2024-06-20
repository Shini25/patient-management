import { Component, OnInit } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { AppointmentService } from '../services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationAppointmentDialogComponent } from '../confirmation-appointment-dialog/confirmation-appointment-dialog.component';
import { DeleteAppointmentConfirmationDialogComponent } from '../delete-appointment-confirmation-dialog/delete-appointment-confirmation-dialog.component';
import { EditAppointmentModalComponent } from '../edit-appointment-modal/edit-appointment-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-rendez-vous',
  templateUrl: './list-rendez-vous.component.html',
  styleUrls: ['./list-rendez-vous.component.css']
})
export class ListAppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  blurredAppointmentId: number | null = null;
  loading: boolean = false;
  blurredPatientId: number | null = null;


  constructor(private appointmentService: AppointmentService, private toastr: ToastrService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadAppointments();
  }


  calculateAge(dateOfBirth: string | Date): { age: number, isLessThanOneYear: boolean, isLessThanOneMonth: boolean } {
    const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    const ageInMilliseconds = today.getTime() - birthDate.getTime();
    const ageDate = new Date(ageInMilliseconds);

    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    const isLessThanOneYear = age < 1;
    const isLessThanOneMonth = ageDate.getUTCMonth() < 1 && isLessThanOneYear;

    return { age, isLessThanOneYear, isLessThanOneMonth };
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
  
  loadAppointments() {
    this.appointmentService.getAllAppointments().subscribe(
      appointment => {
        this.appointments = appointment;
      },
      error => {
        console.error('Error fetching appointment:', error);
      }
    );
  }


  editAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(EditAppointmentModalComponent, {
      width: '400px',
      data: { ...appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateAppointment(result, appointment);
      }
    });
  }

  updateAppointment(updatedAppointment: Appointment, previousAppointment: Appointment): void {
    if (updatedAppointment && updatedAppointment.id !== undefined) {
      this.appointmentService.updateAppointment(updatedAppointment.id, updatedAppointment).subscribe(
        () => {
          this.loadAppointments();
          this.dialog.open(ConfirmationAppointmentDialogComponent, {
            width: '400px',
            data: {
              previous: previousAppointment,
              updated: updatedAppointment
            }
          });
        },
        error => {
          console.error('Error updating appointment:', error);
        }
      );
    } else {
      console.error('Selected appointment or appointment ID is undefined.');
    }
  }

  deleteAppointment(id: number | undefined, appointment: Appointment | undefined): void {
    if (!appointment) {
      console.error('Appointment is undefined.');
      return;
    }

    const dialogRef = this.dialog.open(DeleteAppointmentConfirmationDialogComponent, {
      width: '400px',
      data: { reason: appointment.reason, appointmentDate: appointment.appointmentDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;

        if (id !== undefined) {
          this.appointmentService.deleteAppointment(id).subscribe(
            () => {
              this.loadAppointments();
              this.toastr.success('Suppression du rendez-vous effectuée avec succès !');
            },
            (error: HttpErrorResponse) => {
              console.error('Error deleting appointment:', error);
              if (error.status === 500) {
                this.toastr.error('Le rendez-vous a des consultations associées. Veuillez les supprimer avant de supprimer le rendez-vous.');
              } else {
                this.toastr.error('Une erreur est survenue lors de la suppression du rendez-vous.');
              }
            }
          );
        } else {
          console.error('ID du rendez-vous non défini.');
        }

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }
}

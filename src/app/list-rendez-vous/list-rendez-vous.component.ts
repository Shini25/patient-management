import { Component, OnInit } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { AppointmentService } from '../services/appointment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-rendez-vous',
  templateUrl: './list-rendez-vous.component.html',
  styleUrls: ['./list-rendez-vous.component.css']
})
export class ListAppointmentComponent {

  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  

  constructor(private appointmentService: AppointmentService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAllAppointments().subscribe(
      appointment => {
        this.appointments = appointment;
      },
      error => {
        console.error('Error fetching appointment:', error);
        // Handle error here, display message to user, etc.
      }
    );
  }

  editAppointment(appointementEdit: Appointment) {
    this.selectedAppointment = appointementEdit;
  }

  updateAppointment() {
    if (this.selectedAppointment && this.selectedAppointment.id !== undefined ) {
      this.appointmentService.updateAppointment(this.selectedAppointment.id, this.selectedAppointment).subscribe(
        updatedAppointment => {
          this.toastr.success('Appointment updated successfully!');
          this.loadAppointments();
        },
        error => {
          console.error('Error updating appointment:', error);
          this.toastr.error('Failed to update appointment!');
        }
      );
    } else {
      console.error('Selected appointment or rendez-vous ID is undefined.');
      // Handle error here, display message to user, etc.
    }
  }


loading: boolean = false; // État de chargement initial


  deleteAppointment(id: number | undefined) {

    this.loading = true;

    
    if (id !== undefined) {
        // Appeler le service pour supprimer le médecin
    this.appointmentService.deleteAppointment(id).subscribe(() => {
            // Rafraîchir la liste des médecins après la suppression
        this.loadAppointments();
            this.toastr.success('Suppression du médecin effectuée avec succès !');
        });
    } else {
        console.error('ID du médecin non défini.');
        // Gérer l'erreur ici, afficher un message à l'utilisateur, etc.
    }   
    
        // Cacher l'animation de chargement une fois terminée (après 4 secondes)
        setTimeout(() => {
            this.loading = false;
        }, 1000); // 4 secondes
    };

}


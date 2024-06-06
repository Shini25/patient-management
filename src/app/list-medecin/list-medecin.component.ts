 import { Component, OnInit } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { DoctorService } from '../services/doctor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-medecin',
  templateUrl: './list-medecin.component.html',
  styleUrls: ['./list-medecin.component.css']
})
export class ListDoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;

  constructor(private doctorService: DoctorService, private toastr: ToastrService) {}


  ngOnInit() {
  this.doctorService.getAllDoctors().subscribe(
    doctors => {
      this.doctors = doctors; 
    },
    error => {
      console.error('Error fetching patients:', error);
      // Gérez l'erreur ici, affichez un message à l'utilisateur, etc.
    }
  );
}


  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe(
      doctors => {
        this.doctors = doctors;
      },
      error => {
        console.error('Error fetching doctors:', error);
        // Handle error here, display message to user, etc.
      }
    );
  }

  editMedecin(doctor: Doctor) {
    this.selectedDoctor = doctor;
  }

  updateMedecin() {
    if (this.selectedDoctor && this.selectedDoctor.id !== undefined) {
      this.doctorService.updateDoctor(this.selectedDoctor.id, this.selectedDoctor).subscribe(
        updatedDoctor => {
          this.toastr.success('Medecin updated successfully!');
          this.loadDoctors();
        },
        error => {
          console.error('Error updating doctor:', error);
          this.toastr.error('Failed to update doctor!');
        }
      );
    } else {
      console.error('Selected doctor or  doctor ID is undefined.');
      // Handle error here, display message to user, etc.
    }
  }



loading: boolean = false; // État de chargement initial

  deleteMedecin(id: number | undefined) {

    this.loading = true;

    if (id !== undefined) {
        // Appeler le service pour supprimer le médecin
        this.doctorService.deleteDoctor(id).subscribe(() => {
            // Rafraîchir la liste des médecins après la suppression
            this.loadDoctors();
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
    }

  
}



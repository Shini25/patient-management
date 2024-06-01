import { Component, OnInit} from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-patient',
  templateUrl: './list-patient.component.html',
  styleUrl: './list-patient.component.css'
})
export class ListPatientComponent implements OnInit{

  patients: Patient[] = [];
  selectedPatient: Patient | null = null;


  blurredPatientId: number | null = null;


  calculateAge(dateOfBirth: Date): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

  addBlur(patientId: number | undefined) {
    if (patientId !== undefined) {
      this.blurredPatientId = patientId;
    }
  }


  removeBlur() {
    this.blurredPatientId = null;
  }

constructor(private patientService: PatientService, private toastr: ToastrService) {}


ngOnInit() {
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

formatName(name: string): string {
  return name.length > 12 ? name.slice(0, 9) + '...' : name;
}


editPatient(patient: Patient) {
    this.selectedPatient = patient;
  }

updatePatient() {
  if (this.selectedPatient && this.selectedPatient.id !== undefined) { // Vérifiez si l'ID est défini
    this.patientService.updatePatient(this.selectedPatient.id, this.selectedPatient).subscribe(
      updatedPatient => {
        // Mettre à jour la liste des patients après la modification
        this.patientService.getAllPatients().subscribe(
          patients => {
            this.patients = patients;
          },
          error => {
            console.error('Error fetching patients after update:', error);
          }
        );
      },
      error => {
        console.error('Error updating patients:', error);
        // Handle error here, display message to user, etc.
      }
    );
  } else {
    console.error('Selected patient or patient ID is undefined.');
    // Handle error here, display message to user, etc.
  }
}


loading: boolean = false; // État de chargement initial

  loadPatients() {
    // Appeler le service pour récupérer la liste des patients
    this.patientService.getAllPatients().subscribe((data: any) => {
      this.patients = data;
    });
  }


deletePatient(id: number | undefined) {
    // Afficher l'animation de chargement
    this.loading = true;

    // Appeler le service pour supprimer le patient


    
    if (id !== undefined) {
        // Appeler le service pour supprimer le médecin
    this.patientService.deletePatient(id).subscribe(() => {
            // Rafraîchir la liste des médecins après la suppression
        this.loadPatients();
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




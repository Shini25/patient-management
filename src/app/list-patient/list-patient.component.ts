import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-patient',
  templateUrl: './list-patient.component.html',
  styleUrls: ['./list-patient.component.css']
})
export class ListPatientComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;
  loading: boolean = false;

  constructor(private patientService: PatientService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getAllPatients().subscribe(
      patients => {
        this.patients = patients;
        this.loading = false;
      },
      error => {
        console.error('Error fetching patients:', error);
        this.toastr.error('Error fetching patients');
        this.loading = false;
      }
    );
  }

  editPatient(patient: Patient) {
    this.selectedPatient = patient;
  }

  updatePatient() {
    if (this.selectedPatient && this.selectedPatient.id !== undefined) {
      this.patientService.updatePatient(this.selectedPatient.id, this.selectedPatient).subscribe(
        updatedPatient => {
          this.toastr.success('Patient updated successfully');
          this.loadPatients();
        },
        error => {
          console.error('Error updating patient:', error);
          this.toastr.error('Error updating patient');
        }
      );
    } else {
      console.error('Selected patient or patient ID is undefined.');
      this.toastr.error('Selected patient or patient ID is undefined');
    }
  }

  deletePatient(id: number | undefined) {
    if (id !== undefined) {
      this.loading = true;
      this.patientService.deletePatient(id).subscribe(
        () => {
          this.toastr.success('Patient deleted successfully');
          this.loadPatients();
        },
        error => {
          console.error('Error deleting patient:', error);
          this.toastr.error('Error deleting patient');
          this.loading = false;
        }
      );
    } else {
      console.error('Patient ID is undefined.');
      this.toastr.error('Patient ID is undefined');
    }
  }
}

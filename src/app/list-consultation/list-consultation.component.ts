import { Component, OnInit } from '@angular/core';
import { Consultation } from '../models/consultation.model';
import { ConsultationService } from '../services/consultation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-consultation',
  templateUrl: './list-consultation.component.html',
  styleUrls: ['./list-consultation.component.css']
})
export class ListConsultationComponent implements OnInit {

  consultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  loading: boolean = false;
  blurredPatientId: number | null = null;

  constructor(private consultationService: ConsultationService, private toastr: ToastrService) {}

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

  editConsultation(consultationEdit: Consultation) {
    this.selectedConsultation = consultationEdit;
  }

  updateConsultation() {
    if (this.selectedConsultation && this.selectedConsultation.id !== undefined) {
      this.consultationService.updateConsultation(this.selectedConsultation.id, this.selectedConsultation).subscribe(
        updatedConsultation => {
          this.toastr.success('Consultation updated successfully!');
          this.loadConsultations();
        },
        error => {
          console.error('Error updating consultation:', error);
          this.toastr.error('Failed to update consultation!');
        }
      );
    } else {
      console.error('Selected consultation or consultation ID is undefined.');
    }
  }

  deleteConsultation(id: number | undefined) {
    this.loading = true;
    if (id !== undefined) {
      this.consultationService.deleteConsultation(id).subscribe(() => {
        this.loadConsultations();
        this.toastr.success('Consultation deleted successfully!');
      },
      error => {
        console.error('Error deleting consultation:', error);
        this.toastr.error('Failed to delete consultation!');
      });
    } else {
      console.error('Consultation ID is undefined.');
    }
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
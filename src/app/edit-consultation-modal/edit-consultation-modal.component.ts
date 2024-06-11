import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-consultation-modal',
  templateUrl: './edit-consultation-modal.component.html',
  styleUrls: ['./edit-consultation-modal.component.css'] // Corrected property name from 'styleUrl' to 'styleUrls' and value to array
})
export class EditConsultationModalComponent {

  constructor(
    public dialogRef: MatDialogRef<EditConsultationModalComponent>, // Corrected the generic type to match the component class name
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.dialogRef.close(this.data);
  }
}

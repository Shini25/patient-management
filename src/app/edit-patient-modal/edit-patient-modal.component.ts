import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-patient-modal',
  templateUrl: './edit-patient-modal.component.html',
  styleUrls: ['./edit-patient-modal.component.css']
})
export class EditPatientModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EditPatientModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.dialogRef.close(this.data);
  }
}
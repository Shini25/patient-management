import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-doctor-confirmation-dialog',
  templateUrl: './delete-doctor-confirmation-dialog.component.html',
  styleUrls: ['./delete-doctor-confirmation-dialog.component.css']
})
export class DeleteDoctorConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDoctorConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
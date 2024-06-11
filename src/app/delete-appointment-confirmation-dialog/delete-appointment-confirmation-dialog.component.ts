import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-appointment-confirmation-dialog',
  templateUrl: './delete-appointment-confirmation-dialog.component.html',
  styleUrls: ['./delete-appointment-confirmation-dialog.component.css']
})
export class DeleteAppointmentConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteAppointmentConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
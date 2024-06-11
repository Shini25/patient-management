import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-appointment-dialog',
  templateUrl: './confirmation-appointment-dialog.component.html',
  styleUrls: ['./confirmation-appointment-dialog.component.css']
})
export class ConfirmationAppointmentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
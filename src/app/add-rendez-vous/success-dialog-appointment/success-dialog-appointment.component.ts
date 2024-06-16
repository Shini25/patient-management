import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog-appointment',
  templateUrl: './success-dialog-appointment.component.html',
  styleUrl: './success-dialog-appointment.component.css'
})
export class SuccessDialogAppointmentComponent {
  constructor(public dialogRef: MatDialogRef<SuccessDialogAppointmentComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}

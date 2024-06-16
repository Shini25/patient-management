import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog-doctor',
  templateUrl: './success-dialog-doctor.component.html',
  styleUrl: './success-dialog-doctor.component.css'
})
export class SuccessDialogDoctorComponent {
  constructor(public dialogRef: MatDialogRef<SuccessDialogDoctorComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}

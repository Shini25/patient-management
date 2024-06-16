import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-success-dialog-patient',
  templateUrl: './success-dialog-patient.component.html',
  styleUrl: './success-dialog-patient.component.css'
})
export class SuccessDialogPatientComponent {
  constructor(public dialogRef: MatDialogRef<SuccessDialogPatientComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}

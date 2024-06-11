import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-doctor-dialog',
  templateUrl: './confirmation-doctor-dialog.component.html',
  styleUrls: ['./confirmation-doctor-dialog.component.css']
})
export class ConfirmationDoctorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
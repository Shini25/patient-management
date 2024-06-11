import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-consultation-dialog',
  templateUrl: './confirmation-consultation-dialog.component.html',
  styleUrls: ['./confirmation-consultation-dialog.component.css']
})
export class ConfirmationConsultationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationConsultationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
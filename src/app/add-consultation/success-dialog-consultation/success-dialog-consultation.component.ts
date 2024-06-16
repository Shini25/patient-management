import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog-consultation',
  templateUrl: './success-dialog-consultation.component.html',
  styleUrl: './success-dialog-consultation.component.css'
})
export class SuccessDialogConsultationComponent {
  constructor(public dialogRef: MatDialogRef<SuccessDialogConsultationComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}

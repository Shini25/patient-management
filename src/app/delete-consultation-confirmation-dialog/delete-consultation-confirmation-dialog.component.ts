import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-consultation-confirmation-dialog',
  templateUrl: './delete-consultation-confirmation-dialog.component.html',
  styleUrls: ['./delete-consultation-confirmation-dialog.component.css']
})
export class DeleteConsultationConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConsultationConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
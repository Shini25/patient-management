import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-appointment-modal',
  templateUrl: './edit-appointment-modal.component.html',
  styleUrls: ['./edit-appointment-modal.component.css']
})
export class EditAppointmentModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EditAppointmentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.dialogRef.close(this.data);
  }
}

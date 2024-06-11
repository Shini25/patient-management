  import { Component, Inject } from '@angular/core';
  import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

  @Component({
    selector: 'app-edit-doctor-modal', // Corrected the selector name
    templateUrl: './edit-doctor-modal.component.html', // Corrected the template URL
    styleUrls: ['./edit-doctor-modal.component.css'] // Corrected the style URL
  })
  export class EditDoctorModalComponent {
    constructor(
      public dialogRef: MatDialogRef<EditDoctorModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    closeModal(): void {
      this.dialogRef.close();
    }

    saveChanges(): void {
      this.dialogRef.close(this.data);
    }
  }
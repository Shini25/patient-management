import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-created-dialog',
  template: `
    <h1 mat-dialog-title>Compte créé</h1>
    <div mat-dialog-content>
      <p>Votre compte a été créé avec succès. En attendant la confirmation de l'administrateur, veuillez vérifier votre e-mail régulièrement.</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClose()">OK</button>
    </div>
  `
})
export class AccountCreatedDialogComponent {
  constructor(private dialogRef: MatDialogRef<AccountCreatedDialogComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
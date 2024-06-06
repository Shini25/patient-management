// page-succes.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-succes',
  template: `
<div *ngIf="loadingSpin" class="spinner-container">
    <div class="spinner"></div>
</div>
  `,
  styleUrls: ['./page-succes.component.css'] // Utilisation de styleUrls au lieu de styleUrl
})
export class PageSuccesComponent {
  @Input() loadingSpin: boolean = false;

// Méthode pour déclencher le chargement (par exemple, lors du chargement des données)
startLoading() {
  this.loadingSpin = true;
}

// Méthode pour arrêter le chargement (par exemple, après avoir terminé de charger les données)
stopLoading() {
  this.loadingSpin = false;
  
}
}
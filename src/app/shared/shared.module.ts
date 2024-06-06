// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSuccesComponent } from '../page-succes/page-succes.component';

@NgModule({
  declarations: [PageSuccesComponent],
  imports: [CommonModule],
  exports: [PageSuccesComponent] // Exportez le composant pour qu'il soit disponible pour les autres modules
})
export class SharedModule { }

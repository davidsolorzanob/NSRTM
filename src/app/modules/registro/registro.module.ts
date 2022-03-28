import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContribuyenteComponent } from './contribuyente/contribuyente.component';
import { ListComponent } from './contribuyente/list/list.component';



@NgModule({
  declarations: [
    ContribuyenteComponent,
    ListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RegistroModule { }

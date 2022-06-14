import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { ContribuyenteComponent } from './contribuyente.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ListComponent } from './list.component';
import { contribuyenteRoutes} from 'app/modules/admin/contribuyente/contribuyente.routing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    ContribuyenteComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(contribuyenteRoutes),
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    SharedModule,
    FuseAlertModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatExpansionModule
  ]
})
export class ContribuyenteModule { }






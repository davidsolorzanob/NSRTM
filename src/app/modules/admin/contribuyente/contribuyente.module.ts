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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../contribuyente/date-format';
import { MatStepperModule } from '@angular/material/stepper';
import { ContribuyenteEditarComponent } from './contribuyente-editar.component';
import { ContribuyenteVerComponent } from './contribuyente-ver.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ContribuyenteComponent,
    ListComponent,
    ContribuyenteEditarComponent,
    ContribuyenteVerComponent
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
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    MatStepperModule,
    MatTableModule,
    HttpClientModule,
    MatTabsModule,
    MatTooltipModule
    
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ContribuyenteModule { }






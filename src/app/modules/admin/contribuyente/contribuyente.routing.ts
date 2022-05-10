import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ContribuyenteComponent } from 'app/modules/admin/contribuyente/contribuyente.component';
import { ListComponent } from 'app/modules/admin/contribuyente/list.component';

export const contribuyenteRoutes: Route[] = [
    { path: '', pathMatch : 'full', redirectTo: 'contribuyente'},
    { path: 'contribuyente', component: ContribuyenteComponent},
    { path: 'list',component:ListComponent }
    
];
@NgModule(
    {
   imports: [RouterModule.forRoot(contribuyenteRoutes)],
   exports: [RouterModule]
    }
)

export class ContribuyenteRoutingModule {}
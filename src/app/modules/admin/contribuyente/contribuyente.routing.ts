import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ContribuyenteComponent } from 'app/modules/admin/contribuyente/contribuyente.component';
import { ListComponent } from 'app/modules/admin/contribuyente/list.component';
import { ContribuyenteEditarComponent } from './contribuyente-editar.component';
import { ContribuyenteVerComponent } from './contribuyente-ver.component';

export const contribuyenteRoutes: Route[] = [
    { path: '', pathMatch : 'full', redirectTo: 'contribuyente'},
    { path: 'contribuyente', component: ContribuyenteComponent},
    { path: 'list', component:ListComponent },
    { path: 'contribuyente/:id', component: ContribuyenteComponent},
    { path: 'contribuyente-editar/:id/:dj', component: ContribuyenteEditarComponent},
    { path: 'contribuyente-ver/:id/:dj', component: ContribuyenteVerComponent},
];
@NgModule(
    {
   imports: [RouterModule.forRoot(contribuyenteRoutes)],
   exports: [RouterModule]
    }
)
export class ContribuyenteRoutingModule {}

import { Route } from '@angular/router';
import { ContribuyenteComponent } from 'app/modules/admin/contribuyente/contribuyente.component';
import { ListComponent } from 'app/modules/admin/contribuyente/list/list.component';

export const contribuyenteRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'contribuyente'
    },
    {
        path     : 'contribuyente',
        component: ContribuyenteComponent,
        children : [
            {
                path     : 'list',
                component: ListComponent
            }
        ]
       
    }
];

import { Route } from '@angular/router';
import { ContribuyenteComponent } from './contribuyente/contribuyente.component';
import { ContribuyenteListComponent } from './contribuyente/list/contribuyente.component';
import { ContribuyenteBrandsResolver, ContribuyenteCategoriesResolver, ContribuyenteProductsResolver, ContribuyenteTagsResolver, ContribuyenteVendorsResolver}
from 'app/modules/registro/contribuyente/contribuyente.resolvers';

export const registroRoutes: Route[] = [

    {
        path : '',
        pathMatch : ' full',
        redirectTo:'contribuyente'

    },
    {
        path     : 'contribuyente',
        component: ContribuyenteComponent,
        children : [
            {
                path     : '',
                component: ContribuyenteListComponent,
                resolve  : {
                    brands    : ContribuyenteBrandsResolver,
                    categories: ContribuyenteCategoriesResolver,
                    products  : ContribuyenteProductsResolver,
                    tags      : ContribuyenteTagsResolver,
                    vendors   : ContribuyenteVendorsResolver
                }
            }
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];

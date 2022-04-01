import { Route } from '@angular/router';
import { ContribuyenteComponent } from './contribuyente/contribuyente.component';
import { ContribuyenteBrandsResolver, ContribuyenteCategoriesResolver, ContribuyenteProductsResolver, ContribuyenteTagsResolver, ContribuyenteVendorsResolver}
from 'app/modules/registro/contribuyente/contribuyente.resolvers';

export const registroRoustes: Route[] = [

    {
        path : '',
        pathMatch : ' full',
        redirectTo:'registro'

    },
    {



    }


]

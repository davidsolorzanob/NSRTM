import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ContribuyenteService } from 'app/modules/registro/contribuyente/contribuyente.service';
import { ContribuyenteBrand, ContribuyenteCategory, ContribuyentePagination, ContribuyenteProduct, ContribuyenteTag, ContribuyenteVendor }
 from 'app/modules/registro/contribuyente/contribuyente.types';

@Injectable({
    providedIn: 'root'
})
export class ContribuyenteBrandsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _contribuyenteService: ContribuyenteService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContribuyenteBrand[]>
    {
        return this._contribuyenteService.getBrands();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContribuyenteCategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _contribuyenteService: ContribuyenteService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContribuyenteCategory[]>
    {
        return this._contribuyenteService.getCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContribuyenteProductResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _contribuyenteService: ContribuyenteService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContribuyenteProduct>
    {
        return this._contribuyenteService.getProductById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested product is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContribuyenteProductsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _contribuyenteService: ContribuyenteService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: ContribuyentePagination; products: ContribuyenteProduct[] }>
    {
        return this._contribuyenteService.getProducts();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContribuyenteTagsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _contribuyenteService: ContribuyenteService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContribuyenteTag[]>
    {
        return this._contribuyenteService.getTags();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContribuyenteVendorsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _contribuyenteService: ContribuyenteService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContribuyenteVendor[]>
    {
        return this._contribuyenteService.getVendors();
    }
}

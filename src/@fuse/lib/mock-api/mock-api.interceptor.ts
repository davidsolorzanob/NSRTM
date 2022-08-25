import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, delay, Observable, of, switchMap, throwError } from 'rxjs';
import { FUSE_MOCK_API_DEFAULT_DELAY } from '@fuse/lib/mock-api/mock-api.constants';
import { FuseMockApiService } from '@fuse/lib/mock-api/mock-api.service';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class FuseMockApiInterceptor implements HttpInterceptor
{
    /**
     * Constructor
     */
    constructor(
        @Inject(FUSE_MOCK_API_DEFAULT_DELAY) private _defaultDelay: number,
        private _fuseMockApiService: FuseMockApiService
    )
    {
    }

    /**
     * Intercept
     *
     * @param request
     * @param next
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        const {
                  handler,
                  urlParams
              } = this._fuseMockApiService.findHandler(request.method.toUpperCase(), request.url);

        if ( !handler )
        {
            return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
                    let data = {};
                    data = {
                        reason: error && error.error && error.error.reason ? error.error.reason : '',
                        status: error.status
                    };
                    this.showErrorMessage(error);
                    return throwError(error);
                }));
        }

        handler.request = request;
        handler.urlParams = urlParams;

        return handler.response.pipe(
            delay(handler.delay ?? this._defaultDelay ?? 0),
            switchMap((response) => {
                if ( !response )
                {
                    response = new HttpErrorResponse({
                        error     : 'NOT FOUND',
                        status    : 404,
                        statusText: 'NOT FOUND'
                    });

                    return throwError(response);
                }

                const data = {
                    status: response[0],
                    body  : response[1]
                };

                if ( data.status >= 200 && data.status < 300 )
                {
                    response = new HttpResponse({
                        body      : data.body,
                        status    : data.status,
                        statusText: 'OK'
                    });

                    return of(response);
                }

                response = new HttpErrorResponse({
                    error     : data.body.error,
                    status    : data.status,
                    statusText: 'ERROR'
                });

                return throwError(response);
            }));
    }

    showErrorMessage(err: HttpErrorResponse) {
        let errorMessage: string;
        console.log(err);

        switch(err.status){
            case 400:
            errorMessage = "Petición errónea";
            break;
            case 401:
            errorMessage = "Usted necesita autenticarse para realizar esta acción";
            break;
            case 403:
            errorMessage = "Usted no posee permisos para acceder al recurso solicitado";
            break;
            case 404:
            errorMessage = "El recurso solicitado no existe";
            break;
            case 412:
            errorMessage = "Precondición fallida";
            break;
            case 500:
            errorMessage = "Error interno en el servidor";
            break;
            case 503:
            errorMessage = "El servicio solicitado no se encuentra disponible";
            break;
            case 422:
            errorMessage = "Error de validación";
            break;
            case 0:
            errorMessage = "El servidor y/o servicio no responde";
            break;
            default:
            errorMessage = "Algo salió mal";
        }

        Swal.fire({
            icon: 'warning',
            title: errorMessage,
            text: 'Por favor, comunicarse con el administrador del sistema',
            footer: '<div class="swal2-html-container"><div class="text-sm text-slate-900 text-red-600"> Error ' + err.status.toString() + ':</div><div class="text-sm text-slate-700">'+ err.url+'</div></div>'
        });
    }
}

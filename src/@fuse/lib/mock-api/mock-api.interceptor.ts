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
            errorMessage = "Bad Request.";
            break;
            case 401:
            errorMessage = "You need to log in to do this action.";
            break;
            case 403:
            errorMessage = "You don't have permission to access the requested resource.";
            break;
            case 404:
            errorMessage = "The requested resource does not exist.";
            break;
            case 412:
            errorMessage = "Precondition Failed.";
            break;
            case 500:
            errorMessage = "Internal Server Error.";
            break;
            case 503:
            errorMessage = "The requested service is not available.";
            break;
            case 422:
            errorMessage = "Validation Error!";
            break;
            default:
            errorMessage = "Something went wrong!";
        }

        Swal.fire({
            icon: 'warning',
            title: 'Intente en otro momento',
            text: 'Por favor, comunicarse con el administrador del sistema',
            footer: 'Error al invocar el servicio: <span class="text-red-600"> ' + err.status.toString() + '</span>'
        });
    }
}

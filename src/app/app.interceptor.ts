import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { HandleErrorService } from "./services/handleError.service";

@Injectable()
export class HandleErrorsInterceptor implements HttpInterceptor{
    constructor(private error: HandleErrorService){}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return new Observable((observer)=>{

            next.handle(req).subscribe(

                (res:HttpResponse<any>) =>{
                    if(res instanceof HttpResponse){
                        observer.next(res);
                    }
                },
                (err: HttpErrorResponse) =>{
                    //console.error(err);
                    this.error.handleError(err);
                }
            );
        });
    }
}
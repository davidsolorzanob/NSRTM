import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class HandleErrorService{
    constructor(private toaster: ToastrService){}

    public handleError(err: HttpErrorResponse){
        let errorMessage: string;
        if(err.error instanceof ErrorEvent){
            errorMessage = `Un error encontrado: ${err.error.message}`; 
        }
        else{
            errorMessage = `Something went Wrong`;
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
        }
        //console.error(errorMessage);
        if(errorMessage){
            this.toaster.error(errorMessage);
        }        
    }
}
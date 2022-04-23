import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Domicilio } from '../models/domicilio.models';

@Injectable({
  providedIn: 'root'
})
export class DomicilioService {

  private baseEndpoint = 'http://localhost:8090/api/domicilio';
  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'}); //la cabecera es lo que va a pasar un JSON
  constructor(private http: HttpClient) { }



public listar(): Observable<Domicilio[]>{


  return this.http.get<Domicilio[]>(this.baseEndpoint);



  // return this.http.get(this.baseEndpoint).pipe(   //pipe para usar operadores , catch , etc
  //   map(contribuyentes=> {
  //       return contribuyentes as Contribuyentes[] // es hacer un cast
  //                }
  //       )
  //        //map te permite modificar el flujo any a arreglo
  // );

  //  //la otra forma mas simple es 
 }

 public listarPaginas(page: string, size:  string): Observable<any> {
     const params = new HttpParams()
    .set('page',page)
    .set('size', size);
    return this.http.get<any>(this.baseEndpoint+'/'+page, {params: params});


 }

 public ver(contribuyenteDomicilioId:number): Observable<Domicilio>{

  return this.http.get<Domicilio>(this.baseEndpoint + '/' + contribuyenteDomicilioId);
  //otra forma
  
  //return this.http.get<Contribuyente>({this.baseEndpoint}/${id});

}


public crear(domicilio:Domicilio): Observable<Domicilio>{
//enviar un body

 return this.http.post<Domicilio>(this.baseEndpoint, domicilio, {headers: this.cabeceras});

}

public editar(domicilio:Domicilio): Observable<Domicilio>{

   return this.http.put<Domicilio>(this.baseEndpoint + '/' + domicilio.contribuyenteId, domicilio, {headers: this.cabeceras});

}


public eliminar(contribuyenteId:number): Observable<void>{  //cuando se elimina no devuelve nada

return this.http.delete<void>(this.baseEndpoint + '/' + contribuyenteId)

}



}

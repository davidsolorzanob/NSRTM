import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contribuyente } from '../models/contribuyente.models';

@Injectable({
  providedIn: 'root'
})
export class ContribuyenteService {

  private baseEndpoint = 'http://localhost:8082/api/contribuyente';
  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'}); //la cabecera es lo que va a pasar un JSON
  constructor(private http: HttpClient) { }



public todos(): Observable<Contribuyente[]>{


  return this.http.get<Contribuyente[]>(this.baseEndpoint+'/todos');

}

 public listarPaginas(page: string, size:  string): Observable<any> {
     const params = new HttpParams()
    .set('page',page)
    .set('size', size);
    return this.http.get<any>(this.baseEndpoint+'/pagina/', {params: params});

 }

 public ver(contribuyenteId:number): Observable<Contribuyente>{

  return this.http.get<Contribuyente>(this.baseEndpoint + '/obtener/?id=' + contribuyenteId);

}

public crear(contribuyente:Contribuyente): Observable<Contribuyente>{
//enviar un body

 return this.http.post<Contribuyente>(this.baseEndpoint+'/crear', contribuyente, {headers: this.cabeceras});

}
public editar(contribuyente:Contribuyente): Observable<Contribuyente>{

   return this.http.put<Contribuyente>(this.baseEndpoint + '/editar', contribuyente, {headers: this.cabeceras});

}

public eliminar(contribuyenteId:number): Observable<void>{  //cuando se elimina no devuelve nada

return this.http.delete<void>(this.baseEndpoint + '/eliminar/?id=' + contribuyenteId)

}

public filtrarPorNombre(contribuyente: Contribuyente): Observable<Contribuyente[]>{
  return this.http.post<Contribuyente[]>(this.baseEndpoint+'/filtrar/',contribuyente, {headers: this.cabeceras});
}


}

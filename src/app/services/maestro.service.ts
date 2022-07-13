import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Maestro } from '../models/maestro.models';

@Injectable({
  providedIn: 'root'
})
export class MaestroService {

  private baseEndpoint = 'http://localhost:8083/api/maestro';
  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'}); //la cabecera es lo que va a pasar un JSON
  constructor(private http: HttpClient) { }



public todos(): Observable<Maestro[]>{


  return this.http.get<Maestro[]>(this.baseEndpoint+'/');

}

 public listarPaginas(page: string, size:  string): Observable<any> {
     const params = new HttpParams()
    .set('page',page)
    .set('size', size);
    return this.http.get<any>(this.baseEndpoint+'/pagina/', {params: params});

 }

 public ver(tipoMaestroId:number, municipalidadId:number): Observable<Maestro>{
  console.log(tipoMaestroId);
  return this.http.get<Maestro>(this.baseEndpoint + '/filtrarportipo/?tipoMaestroId=' + tipoMaestroId + '&municipalidadId=' + municipalidadId );

}

public crear(maestro:Maestro): Observable<Maestro>{
//enviar un body

 return this.http.post<Maestro>(this.baseEndpoint+'/crear', maestro, {headers: this.cabeceras});

}
public editar(maestro:Maestro): Observable<Maestro>{

   return this.http.put<Maestro>(this.baseEndpoint + '/editar', maestro, {headers: this.cabeceras});

}

public eliminar(maestroId:number): Observable<void>{  //cuando se elimina no devuelve nada

return this.http.delete<void>(this.baseEndpoint + '/eliminar/?id=' + maestroId)

}

public filtrarPorNombre(maestro: Maestro): Observable<Maestro[]>{
  return this.http.post<Maestro[]>(this.baseEndpoint+'/filtrar/', maestro , {headers: this.cabeceras});
}

}

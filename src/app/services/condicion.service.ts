import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Condicion } from '../models/condicion.models';

@Injectable({
    providedIn: 'root'
})
export class CondicionService {

    private baseEndpoint = 'http://localhost:8082/api/condicioncontribuyente';
    private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); //la cabecera es lo que va a pasar un JSON
    constructor(private http: HttpClient) { }



    public todos(): Observable<Condicion[]> {


        return this.http.get<Condicion[]>(this.baseEndpoint + '/todos');

    }

    //  public listarPaginas(page: string, size:  string): Observable<any> {
    //      const params = new HttpParams()
    //     .set('nroPage',page)
    //     .set('size', size);
    //     return this.http.get<any>(this.baseEndpoint+'/pagina/', {params: params});

    //  }

    public listarPaginas(size: string, page: string): Observable<any> {
        var params = {
            "data": { "tipoFiltro": null, "municipalidadId": "1" },
            "size": size,
            "nroPage": page
        };
        //return this.http.get<any>(this.baseEndpoint+'/listaContribuyentePaginado/', params);
        return this.http.post<any>(this.baseEndpoint + '/listaContribuyentePaginado', params, { headers: this.cabeceras });



    }

    public ver(contribuyenteId: number): Observable<Condicion> {

        return this.http.get<Condicion>(this.baseEndpoint + '/obtener/?id=' + contribuyenteId);

    }

    public crear(contribuyente: Condicion): Observable<Condicion> {
        //enviar un body
        return this.http.post<Condicion>(this.baseEndpoint + '/crear', contribuyente, { headers: this.cabeceras });
    }
    public guardar(contribuyente: Condicion): Observable<Condicion> {
        //enviar un body
        return this.http.post<Condicion>(this.baseEndpoint + '/guardar', contribuyente, { headers: this.cabeceras });
    }
    public editar(contribuyente: Condicion): Observable<Condicion> {

        return this.http.put<Condicion>(this.baseEndpoint + '/editar', contribuyente, { headers: this.cabeceras });

    }

    public eliminar(contribuyenteId: number): Observable<void> {  //cuando se elimina no devuelve nada

        return this.http.delete<void>(this.baseEndpoint + '/eliminar/?id=' + contribuyenteId)

    }

    public filtrarPorNombre(contribuyente: Condicion): Observable<Condicion[]> {
        return this.http.post<Condicion[]>(this.baseEndpoint + '/filtrar/', contribuyente, { headers: this.cabeceras });
    }


}

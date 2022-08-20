import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Contacto } from '../models/contacto.models';

@Injectable({
    providedIn: 'root'
})
export class ContactoService {

    private baseEndpoint = 'http://localhost:8082/api/contacto';
    private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); //la cabecera es lo que va a pasar un JSON
    constructor(private http: HttpClient) { }

    public todos(): Observable<Contacto[]> {
        return this.http.get<Contacto[]>(this.baseEndpoint + '/todos');
    }
    public listarPaginas(size: string, page: string): Observable<any> {
        var params = {
            "data": { "tipoFiltro": null, "municipalidadId": "1" },
            "size": size,
            "nroPage": page
        };
        return this.http.post<any>(this.baseEndpoint + '/listaContribuyentePaginado', params, { headers: this.cabeceras });
    }

    public listar(municipalidadId: number, contribuyenteId: number, numeroDJ: number): Observable<Contacto[]> {
        return this.http.get<Contacto[]>(this.baseEndpoint + '/listar/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteId + '&numeroDJ=' + numeroDJ);
    }
}

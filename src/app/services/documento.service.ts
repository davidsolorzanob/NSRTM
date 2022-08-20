import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DocSustento } from '../models/docSustento.models';

@Injectable({
    providedIn: 'root'
})
export class DocumentoService {

    private baseEndpoint = 'http://localhost:8082/api/docsustento';
    private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); //la cabecera es lo que va a pasar un JSON
    constructor(private http: HttpClient) { }


    public listar(municipalidadId: number ,contribuyenteId: number  , numeroDJ: number): Observable<DocSustento[]> {

        return this.http.get<DocSustento[]>(this.baseEndpoint + '/listar/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteId + '&numeroDJ=' + numeroDJ);
    }


}

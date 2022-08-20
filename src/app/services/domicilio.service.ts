import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Domicilio } from '../models/domicilio.models';

@Injectable({
    providedIn: 'root'
})
export class DomicilioService {

    private baseEndpoint = 'http://localhost:8082/api/domiciliocontribuyente';
    private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); //la cabecera es lo que va a pasar un JSON
    constructor(private http: HttpClient) { }




    public guardar(domicilio: Domicilio): Observable<Domicilio> {
        //enviar un body
        console.log('llego domicilio  okkkkk', domicilio);
        return this.http.post<Domicilio>(this.baseEndpoint + '/guardar', domicilio, { headers: this.cabeceras });

    }

    public obtener(municipalidadId: number ,contribuyenteId: number , numeroDJ: number): Observable<Domicilio> {

        return this.http.get<Domicilio>(this.baseEndpoint + '/obtener/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteId + '&numeroDJ=' + numeroDJ);
    }
    public listar(municipalidadId: number ,contribuyenteId: number  , numeroDJ: number): Observable<Domicilio[]> {

        return this.http.get<Domicilio[]>(this.baseEndpoint + '/listar/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteId + '&numeroDJ=' + numeroDJ);
    }


}

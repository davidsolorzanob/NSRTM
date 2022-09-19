import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Relacionado } from 'app/models/relacionado.models';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RelacionadoService {

    private baseEndpoint = 'http://localhost:8082/api/relacionado';
    private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    constructor(private http: HttpClient) { }

    public guardar(relacionado: Relacionado): Observable<Relacionado> {
        console.log('llego relacionado', relacionado);
        return this.http.post<Relacionado>(this.baseEndpoint + '/guardar', relacionado, { headers: this.cabeceras });
    }
    public obtener(municipalidadId: number, contribuyenteId: number, numeroDJ: number): Observable<Relacionado> {
        return this.http.get<Relacionado>(this.baseEndpoint + '/obtenercondomicilio/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' +
        contribuyenteId + '&numeroDJ=' + numeroDJ);
    }
}

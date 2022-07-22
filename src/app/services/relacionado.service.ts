import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Relacionado } from 'app/models/relacionado.models';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RelacionadoService {

    private baseEndpoint = 'http://localhost:8082/api/relacionado';
    private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); //la cabecera es lo que va a pasar un JSON
    constructor(private http: HttpClient) { }




    public guardar(relacionado: Relacionado): Observable<Relacionado> {
        //enviar un body
        console.log('llego relacionado', relacionado);
        return this.http.post<Relacionado>(this.baseEndpoint + '/guardar', relacionado, { headers: this.cabeceras });

    }


}

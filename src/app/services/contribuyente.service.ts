import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Condicion } from 'app/models/condicion.models';
import { Domicilio } from 'app/models/domicilio.models';
import { Relacionado } from 'app/models/relacionado.models';
import { RelacionadoDomicilio } from 'app/models/relacionadoDomicilio.models';
import { map, Observable } from 'rxjs';
import { Contribuyente } from '../models/contribuyente.models';
import { contribuyenteCrear } from 'app/models/contribuyenteCrear';

@Injectable({
    providedIn: 'root'
})
export class ContribuyenteService {

    private baseEndpoint = 'http://localhost:8082/api/contribuyente';
    private baseEndpointCondicion = 'http://localhost:8082/api/condicioncontribuyente'
    private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); //la cabecera es lo que va a pasar un JSON
    constructor(private http: HttpClient) { }


    public todos(): Observable<Contribuyente[]> {
        return this.http.get<Contribuyente[]>(this.baseEndpoint + '/todos');
    }

    public listarPaginas(size: string, page: string): Observable<any> {
        var params = {
            "data": { "tipoFiltro": null, "municipalidadId": "1" },
            "size": size,
            "nroPage": page
        };
        return this.http.post<any>(this.baseEndpoint + '/listaContribuyentePaginado', params, { headers: this.cabeceras });
    }
    public ver(contribuyenteId: number): Observable<Contribuyente> {

        return this.http.get<Contribuyente>(this.baseEndpoint + '/obtener/?id=' + contribuyenteId);
    }
    // public crear(contribuyente: Contribuyente): Observable<Contribuyente> {
    //     //enviar un body
    //     return this.http.post<Contribuyente>(this.baseEndpoint + '/crear', contribuyente, { headers: this.cabeceras });
    // }

    public crear(contribuyente: Contribuyente, condicioncontribuyente: Condicion, domicilioContribuyente: Domicilio, relacionado:RelacionadoDomicilio): Observable<contribuyenteCrear> {
        //enviar un body

        var params = {
            "contribuyente": contribuyente,
            "condicionContribuyente": condicioncontribuyente,
            "domicilioContribuyente": domicilioContribuyente,
            "relacionado": relacionado

        };

        return this.http.post<contribuyenteCrear>(this.baseEndpoint + '/guardar', params, { headers: this.cabeceras });
    }


    public guardar(contribuyente: Contribuyente): Observable<Contribuyente> {
        //enviar un body
        return this.http.post<Contribuyente>(this.baseEndpoint + '/guardar', contribuyente, { headers: this.cabeceras });
    }
    public editar(contribuyente: Contribuyente): Observable<Contribuyente> {

        return this.http.put<Contribuyente>(this.baseEndpoint + '/editar', contribuyente, { headers: this.cabeceras });
    }

    public eliminar(municipalidadId: number , contribuyenteNumero: number): Observable<void> {  //cuando se elimina no devuelve nada

        var params = {
            "municipalidadId": municipalidadId,
            "contribuyenteNumero": contribuyenteNumero
        };

        return this.http.post<void>(this.baseEndpoint + '/eliminar/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteNumero,  {headers: this.cabeceras});

    }

    // public obtener(municipalidadId: number ,contribuyenteId: number): Observable<Condicion> {

    //     return this.http.get<Condicion>(this.baseEndpoint + '/obtener/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteId);
    // }



//ObtenerPorId(Long municipalidadId, Long contribuyenteNumero)
    public obtener(municipalidadId: number ,contribuyenteId: number): Observable<Contribuyente> {

        return this.http.get<Contribuyente>(this.baseEndpoint + '/obtener/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteId);
    }

    public filtrarPorNombre(contribuyente: Contribuyente): Observable<Contribuyente[]> {
        return this.http.post<Contribuyente[]>(this.baseEndpoint + '/filtrar/', contribuyente, { headers: this.cabeceras });
    }

    //Relacionado
    public crearRelacionado(relacionado: Relacionado): Observable<Relacionado> {
        //enviar un body
        return this.http.post<Relacionado>(this.baseEndpoint + '/crear', relacionado, { headers: this.cabeceras });
    }
}

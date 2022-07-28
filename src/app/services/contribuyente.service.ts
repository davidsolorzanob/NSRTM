import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Condicion } from 'app/models/condicion.models';
import { Domicilio } from 'app/models/domicilio.models';
import { Relacionado } from 'app/models/relacionado.models';
import { RelacionadoDomicilio } from 'app/models/relacionadoDomicilio.models';
import { Observable } from 'rxjs';
import { Contribuyente } from '../models/contribuyente.models';
import { contribuyenteCrear } from 'app/models/contribuyenteCrear';
import { map } from 'rxjs/operators';

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

    public listarPaginas(contribuyente: Contribuyente, size: string, page: string): Observable<any> {
        var params = {
            "data": contribuyente,
            "size": size,
            "nroPage": page
        };
        return this.http.post<any>(this.baseEndpoint + '/listaContribuyentePaginado', params, { headers: this.cabeceras });
    }

    public getReporteBusquedaExcel(busqueda: string ) {
        //let params = new HttpParams().set("keyword", busqueda);
        //return this.http.get<any>(this.baseEndpoint + '/exportarExcel', busqueda);
        return this.http.get(this.baseEndpoint + '/exportarExcel?data='+ encodeURIComponent(busqueda), { responseType: 'arraybuffer' }).pipe(map((res: ArrayBuffer) => { return res; }));
    }

    public ver(contribuyenteId: number): Observable<Contribuyente> {

        return this.http.get<Contribuyente>(this.baseEndpoint + '/obtener/?id=' + contribuyenteId);
    }

    public crear(contribuyente: Contribuyente, condicioncontribuyente: Condicion, domicilioContribuyente: Domicilio, relacionado:RelacionadoDomicilio): Observable<contribuyenteCrear> {
        var params = {
            "contribuyente": contribuyente,
            "condicionContribuyente": condicioncontribuyente,
            "domicilioContribuyente": domicilioContribuyente,
            "relacionado": relacionado
        };
        return this.http.post<contribuyenteCrear>(this.baseEndpoint + '/guardar', params, { headers: this.cabeceras });
    }

    public guardar(contribuyente: Contribuyente): Observable<Contribuyente> {
        return this.http.post<Contribuyente>(this.baseEndpoint + '/guardar', contribuyente, { headers: this.cabeceras });
    }

    public editar(contribuyente: Contribuyente): Observable<Contribuyente> {
        return this.http.put<Contribuyente>(this.baseEndpoint + '/editar', contribuyente, { headers: this.cabeceras });
    }

    public eliminar(contribuyenteId: number): Observable<void> {  //cuando se elimina no devuelve nada
        return this.http.delete<void>(this.baseEndpoint + '/eliminar/?id=' + contribuyenteId)
    }

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

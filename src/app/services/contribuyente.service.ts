import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Condicion } from 'app/models/condicion.models';
import { Domicilio } from 'app/models/domicilio.models';
import { Relacionado } from 'app/models/relacionado.models';
import { RelacionadoDomicilio } from 'app/models/relacionadoDomicilio.models';
import { DocSustento } from 'app/models/docSustento.models';
import { map, Observable } from 'rxjs';
import { Contribuyente } from '../models/contribuyente.models';
import { ContribuyenteReporte } from '../models/contribuyenteReporte.models';
import { contribuyenteCrear } from 'app/models/contribuyenteCrear';
import { Contacto } from 'app/models/contacto.models';

@Injectable({
    providedIn: 'root'
})
export class ContribuyenteService {

    private baseEndpoint = 'http://localhost:8082/api/contribuyente';
    private baseEndpointCondicion = 'http://localhost:8082/api/condicioncontribuyente'
    private baseEndpointReporte = 'http://localhost:8087/api/reportes';
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
        return this.http.get(this.baseEndpoint + '/exportarExcel?data='+ encodeURIComponent(busqueda), { responseType: 'arraybuffer' }).pipe(map((res: ArrayBuffer) => { return res; }));
    }

    public getReporteDjContribuyente(busqueda: string ) {
        return this.baseEndpointReporte + '/djcontribuyente?data='+ encodeURIComponent(busqueda);
    }

    public ver(contribuyenteId: number): Observable<Contribuyente> {
        return this.http.get<Contribuyente>(this.baseEndpoint + '/obtener/?id=' + contribuyenteId);
    }

    public crear(contribuyente: Contribuyente, condicioncontribuyente: Condicion, domicilioContribuyente: Domicilio, relacionado:RelacionadoDomicilio,
        contactos: Contacto[], domicilios: Domicilio[], docSustento: DocSustento[]): Observable<contribuyenteCrear> {
console.log('llego todoooooooo');
       console.log(contribuyente,condicioncontribuyente,domicilioContribuyente,relacionado,contactos);
            var params = {
            "contribuyente": contribuyente,
            "condicionContribuyente": condicioncontribuyente,
            "domicilioContribuyente": domicilioContribuyente,
            "relacionado": relacionado,
            "contactos":contactos,
            "domicilios": domicilios,
            "sustentos":  docSustento
        };
        return this.http.post<contribuyenteCrear>(this.baseEndpoint + '/guardar', params, { headers: this.cabeceras });
    }

    public actualizar(contribuyente: Contribuyente, condicioncontribuyente: Condicion, domicilioContribuyente: Domicilio, relacionado:RelacionadoDomicilio,
        contactos: Contacto[], domicilios: Domicilio[], docSustento: DocSustento[]): Observable<contribuyenteCrear> {
console.log('llego todoooooooo');
       console.log(contribuyente,condicioncontribuyente,domicilioContribuyente,relacionado,contactos);
            var params = {
            "contribuyente": contribuyente,
            "condicionContribuyente": condicioncontribuyente,
            "domicilioContribuyente": domicilioContribuyente,
            "relacionado": relacionado,
            "contactos":contactos,
            "domicilios": domicilios,
            "sustentos":  docSustento
        };
        return this.http.post<contribuyenteCrear>(this.baseEndpoint + '/actualizar', params, { headers: this.cabeceras });
    }

    public guardar(contribuyente: Contribuyente): Observable<Contribuyente> {
        return this.http.post<Contribuyente>(this.baseEndpoint + '/guardar', contribuyente, { headers: this.cabeceras });
    }

    public obtenerHistorico(municipalidadId: number ,contribuyenteId: number): Observable<DocSustento> {
        return this.http.get<DocSustento>(this.baseEndpoint + '/listaContribuyenteHistorico/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteId);
    }

    public editar(contribuyente: Contribuyente): Observable<Contribuyente> {
        return this.http.put<Contribuyente>(this.baseEndpoint + '/editar', contribuyente, { headers: this.cabeceras });
    }

    public eliminar(municipalidadId: number , contribuyenteNumero: number, numeroDJ: number): Observable<void> {  //cuando se elimina no devuelve nada
        var params = {
            "municipalidadId": municipalidadId,
            "contribuyenteNumero": contribuyenteNumero,
            "numeroDJ": numeroDJ
        };
        return this.http.post<void>(this.baseEndpoint + '/eliminar/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteNumero + '&numeroDJ=' + numeroDJ,  {headers: this.cabeceras});
    }

    public obtener(municipalidadId: number ,contribuyenteId: number, numeroDJ: number): Observable<Contribuyente> {
        return this.http.get<Contribuyente>(this.baseEndpoint + '/obtener/?municipalidadId=' + municipalidadId + '&contribuyenteNumero=' + contribuyenteId + '&numeroDJ=' + numeroDJ);
    }

    public filtrarPorNombre(contribuyente: Contribuyente): Observable<Contribuyente[]> {
        return this.http.post<Contribuyente[]>(this.baseEndpoint + '/filtrar/', contribuyente, { headers: this.cabeceras });
    }

    public crearRelacionado(relacionado: Relacionado): Observable<Relacionado> {
        return this.http.post<Relacionado>(this.baseEndpoint + '/crear', relacionado, { headers: this.cabeceras });
    }
}

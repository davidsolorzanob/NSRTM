import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ubigeoProvincia } from 'app/models/ubigeoProvincia.models';
import { Observable } from 'rxjs';
import { UbigeoDepartamento } from '../models/UbigeoDepartamento.models';
import { ubigeoDistrito } from '../models/ubigeoDistrito.models';
@Injectable({
    providedIn: 'root'
})
export class UbigeoService {

    private baseEndpoint = 'http://localhost:8085/api';


    private cabeceras: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); //la cabecera es lo que va a pasar un JSON
    constructor(private http: HttpClient) { }


    public todos(): Observable<UbigeoDepartamento> {

        return this.http.get<UbigeoDepartamento>(this.baseEndpoint + '/departamento/todos');

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

    public ver(contribuyenteId: number): Observable<UbigeoDepartamento> {

        return this.http.get<UbigeoDepartamento>(this.baseEndpoint + '/obtener/?id=' + contribuyenteId);

    }

    public verProvincia(departamentoId: number): Observable<ubigeoProvincia> {

        return this.http.get<ubigeoProvincia>(this.baseEndpoint + '/provincia/filtrarpordepartamento/?idDepartamento=' + departamentoId);
    }

    public verDistrito(departamentoId: number, provinciaId: number): Observable<ubigeoDistrito> {

        return this.http.get<ubigeoDistrito>(this.baseEndpoint + '/distrito/filtrarporprovincia/?idDepartamento=' + departamentoId + '&idProvincia=' + provinciaId);
    }

    public crear(contribuyente: UbigeoDepartamento): Observable<UbigeoDepartamento> {
        //enviar un body
        return this.http.post<UbigeoDepartamento>(this.baseEndpoint + '/crear', contribuyente, { headers: this.cabeceras });
    }
    public guardar(contribuyente: UbigeoDepartamento): Observable<UbigeoDepartamento> {
        //enviar un body
        return this.http.post<UbigeoDepartamento>(this.baseEndpoint + '/guardar', contribuyente, { headers: this.cabeceras });
    }
    public editar(contribuyente: UbigeoDepartamento): Observable<UbigeoDepartamento> {

        return this.http.put<UbigeoDepartamento>(this.baseEndpoint + '/editar', contribuyente, { headers: this.cabeceras });

    }

    public eliminar(contribuyenteId: number): Observable<void> {  //cuando se elimina no devuelve nada

        return this.http.delete<void>(this.baseEndpoint + '/eliminar/?id=' + contribuyenteId)

    }

    public filtrarPorNombre(contribuyente: UbigeoDepartamento): Observable<UbigeoDepartamento[]> {
        return this.http.post<UbigeoDepartamento[]>(this.baseEndpoint + '/filtrar/', contribuyente, { headers: this.cabeceras });
    }


}

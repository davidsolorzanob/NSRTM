import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contribuyente } from 'app/models/contribuyente.models';
import { Maestro } from 'app/models/maestro.models';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { MaestroService } from 'app/services/maestro.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-contribuyente',
    templateUrl: './contribuyente.component.html',
    styleUrls: ['./contribuyente.component.css']
})



export class ContribuyenteComponent implements OnInit {

    contribuyente: Contribuyente = new Contribuyente();
    maestro: Maestro = new Maestro();

    error: any;

    contribuyentes: Contribuyente[];

    maestrosTipoMedio: Maestro[] = [];
    maestrosMedio: Maestro[] = [];
    maestrosMotivo: Maestro[] = [];
    maestrosModalidadOficio: Maestro[] = [];
    maestrosTipoContribuyente: Maestro[] = [];
    maestrosTipodocumento: Maestro[] = [];

    //Domicilio

    maestrosDepartamento: Maestro[] = [];
    maestrosProvincia: Maestro[] = [];
    maestrosDistrito: Maestro[] = [];
    maestrosTipoDomicilio: Maestro[] = [];
    maestrosTipoVia: Maestro[] = [];
    maestrosZonaUrbana: Maestro[] = [];
    maestrosSubZona: Maestro[] = [];
    maestrosEdificacion: Maestro[] = [];
    maestrosInterior: Maestro[] = [];
    maestrosEstado: Maestro[] = [];

    //Condición

    maestrosCondicionContribuyente: Maestro[] = [];


    panelContribuyenteOpenState = false;
    panelDomicilioFiscal = false;
    panelRelacionado = false;
    panelCondicion = false;
    panelContacto = false;
    panelInformacionAdicional = false;
    panelSustento;
    panelOpenState = false;


    constructor(private service: ContribuyenteService,
        private router: Router,
        private route: ActivatedRoute, private serviceMaestro: MaestroService) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id: number = +params.get('id');
            console.log(id + 'nuevo request');
            if (id) {
                this.service.ver(id).subscribe(contribuyente => this.contribuyente = contribuyente);


            }

        })
    }

    ngAfterViewInit() {

        this.maestroGenerico(3,'maestrosMedio');
        this.maestroGenerico(2,'maestrosTipoMedio');
        this.maestroGenerico(4,'maestrosMotivo');
        this.maestroGenerico(12,'maestrosModalidadOficio');
        this.maestroGenerico(14,'maestrosTipoContribuyente');
        this.maestroGenerico(1,'maestrosTipoDocumento');

    }


    public crear(): void {
        this.service.crear(this.contribuyente).subscribe({
            next: (contribuyente) => {
                console.log(contribuyente);
                // alert('Contribuyente creado con exito ${contribuyente.nombres}');
                Swal.fire('Nuevo:', `Contribuyente ${this.contribuyente.nombres} creado con éxito`, 'success');
                this.router.navigate(['../contribuyente/list']);
            }
            , error: (err) => {
                if (err.status === 400) {
                    this.error = err.error;
                    console.log(this.error);
                }
            }
        });
    }

    public editar(): void {
        this.service.editar(this.contribuyente).subscribe({
            next: (contribuyente) => {
                console.log(contribuyente);
                //alert('Contribuyente fue editado con exito ${this.contribuyente.nombres}');
                Swal.fire('Editado:', `Contribuyente ${this.contribuyente.nombres} editado con éxito`, 'success');
                this.router.navigate(['../contribuyente/list']);
            }
            , error: (err) => {
                if (err.status === 400) {
                    this.error = err.error;
                    console.log(this.error);
                }
                if (err.status === 500) {
                    this.error = err.error;
                    console.log(this.error);
                }
            }
        });
    }

    cargaTipoMedio() {

        this.serviceMaestro.ver(2)
            .subscribe({
                next: (res: any) => {
                    console.log('TIPO DE MEDIO', res);
                    this.maestrosTipoMedio = res;
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperaciónb del Tipo de Medio');
                }
            });
    }


    cargaMedio() {

        this.serviceMaestro.ver(3)
            .subscribe({
                next: (res: any) => {
                    console.log('MEDIO', res);
                    this.maestrosMedio = res;
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de Medio');
                }
            });
    }



    maestroGenerico(tipo:number, matriz: string) {

        this.serviceMaestro.ver(tipo)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                   // matriz = res;
                    if(matriz == 'maestrosTipoMedio')
                    {
                        console.log(matriz);
                        this.maestrosTipoMedio = res;
                    }
                    if(matriz == 'maestrosMedio')
                    {
                        console.log(matriz);
                        this.maestrosMedio = res;
                    }
                    if(matriz == 'maestrosMotivo')
                    {
                        console.log(matriz);
                        this.maestrosMotivo = res;
                    }
                    if(matriz == 'maestrosModalidadOficio')
                    {
                        console.log(matriz);
                        this.maestrosModalidadOficio = res;
                    }




                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de Motivo');
                }
            });
    }



}

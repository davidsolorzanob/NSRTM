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
    //maestros: Maestro[];
    maestrosTipoMedio: Maestro[] = [];
    maestrosMedio: Maestro[] = [];


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
        this.cargaTipoMedio();
        this.cargaMedio();
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
                    console.log('completo la recuperaciónb de Medio');
                }
            });
    }

}

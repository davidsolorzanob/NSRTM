import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contribuyente } from 'app/models/contribuyente.models';
import { Maestro } from 'app/models/maestro.models';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { MaestroService } from 'app/services/maestro.service';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';

const moment = _rollupMoment || _moment;

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
    maestrosTipoDocumento: Maestro[] = [];

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

    todayDate: Date = new Date();
    date = new FormControl(moment([2017, 0, 1]));
    public registerForm!: FormGroup;

    isAddMode!: boolean;
    loading = false;
    submitted = false;
    //     myDate = new Date();
    // constructor(private datePipe: DatePipe){
    //     this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    // }

    constructor(private service: ContribuyenteService,
        private router: Router,
        private route: ActivatedRoute, private serviceMaestro: MaestroService,
        private formBuilder: FormBuilder) {

    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id: number = +params.get('id');
            console.log(id + 'nuevo request');
            if (id) {
                this.service.ver(id).subscribe(contribuyente => this.contribuyente = contribuyente);
            }
        })

        this.registerForm = this.formBuilder.group({
            codContribuyente: [''],
            nroDeclaracion: [''],
            fechaDeclaracion: [''],
            tipoMedioDeterminacionId: [''],
            medioDeterminacionId: [''],
            motivoDjId: [''],
            modalidadOficio: [''],
            tipoPersonaId: [''],
            docIdentidadId: ['', [Validators.required]],
            numDocIdentidad: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
            fechaInscripcion: [''],
            fechaNacimiento: [''],
            estadoDjId: [''],
            apellidoPaterno: this.formBuilder.control('', Validators.required),
            apellidoMaterno: ['', [Validators.required]],
            nombres: ['', [Validators.required]],
            estadoCivil: [''],
            fallecido: [''],
            fechaFallecimiento: [''],
            razonSocial: [''],
            segContribuyenteId: [''],
        });
    }

    ngAfterViewInit() {

        this.maestroGenerico(3, 'maestrosMedio');
        this.maestroGenerico(2, 'maestrosTipoMedio');
        this.maestroGenerico(4, 'maestrosMotivo');
        this.maestroGenerico(12, 'maestrosModalidadOficio');
        this.maestroGenerico(14, 'maestrosTipoContribuyente');
        this.maestroGenerico(1, 'maestrosTipoDocumento');

    }


    onSubmit() {

        console.log('envio');
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

    // private createContribuyente() {
    //     this.service.guardar(this.registerForm.value)
    //       .pipe(first())
    //       .subscribe(() => {
    //         Swal.fire('Nuevo:', `Contribuyente ${this.contribuyente.nombres} creado con éxito`, 'success');
    //         this.router.navigate(['../contribuyente/list']);
    //         //this.mostrarSnakbar('Registro se ha creado satisfactoriamente..!')
    //         //this.router.navigate(['/nsrtm-rate-payer-app'], { relativeTo: this.activatedRoute });
    //       })
    //       .add(() => this.loading = false);
    //   }

    public guardar(): void {
        console.log('llego');
        this.service.guardar(this.contribuyente).subscribe({
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




    maestroGenerico(tipo: number, matriz: string) {

        this.serviceMaestro.ver(tipo)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    // matriz = res;
                    if (matriz == 'maestrosTipoMedio') {
                        console.log(matriz);
                        this.maestrosTipoMedio = res;
                    }
                    if (matriz == 'maestrosMedio') {
                        console.log(matriz);
                        this.maestrosMedio = res;
                    }
                    if (matriz == 'maestrosMotivo') {
                        console.log(matriz);
                        this.maestrosMotivo = res;
                    }
                    if (matriz == 'maestrosModalidadOficio') {
                        console.log(matriz);
                        this.maestrosModalidadOficio = res;
                    }
                    if (matriz == 'maestrosTipoDocumento') {
                        console.log(matriz);
                        this.maestrosTipoDocumento = res;
                    }
                    if (matriz == 'maestrosTipoContribuyente') {
                        console.log(matriz);
                        this.maestrosTipoContribuyente = res;
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

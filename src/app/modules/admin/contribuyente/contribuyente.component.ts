import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contribuyente } from 'app/models/contribuyente.models';
import { Domicilio } from 'app/models/domicilio.models';
import { Relacionado } from 'app/models/relacionado.models';
import { Condicion } from 'app/models/condicion.models';
import { Maestro } from 'app/models/maestro.models';
import { ContribuyenteService } from 'app/services/contribuyente.service';

import { MaestroService } from 'app/services/maestro.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import * as _moment from 'moment';
import { Moment } from 'moment';
const moment = _moment;

@Component({
    selector: 'app-contribuyente',
    templateUrl: './contribuyente.component.html',
    styleUrls: ['./contribuyente.component.css']
})



export class ContribuyenteComponent implements OnInit {

    contribuyente: Contribuyente = new Contribuyente();
    domicilio: Domicilio = new Domicilio();
    relacionado: Relacionado = new Relacionado();
    condicion: Condicion = new Condicion();
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
    maestrosEstadoDj: Maestro[] = [];
    maestrosEstadoCivil: Maestro[] = [];


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
    public registerFormContribuyente!: FormGroup;
    public registerFormContribuyenteDomicilio!: FormGroup;
    public registerFormContribuyenteRelacionado!: FormGroup;
    public registerFormContribuyenteCondicion!: FormGroup;
    public registerFormContribuyenteContacto!: FormGroup;


    isAddMode!: boolean;
    loading = false;
    submitted = false;


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
        //this.registerFormContribuyente.get('fallecido').disable();
        // this.registerFormContribuyente = this.formBuilder.group({
        //     name: new FormControl({ value: '', disabled: this.disabled })
        // });
        this.panelContribuyenteOpenState>= true;
        this.registerFormContribuyente = this.formBuilder.group({
            codContribuyente: [{value: '', disabled:true}],
            nroDeclaracion: [{value: '', disabled:true}],
            fechaDJ: [''],
            tipoMedioDeterminacionId: ['', [Validators.required]],
            medioDeterminacionId: ['', [Validators.required]],
            motivoDjId: ['', [Validators.required]],
            modalidadOficio: [''],
            tipoPersonaId: ['', [Validators.required]],
            docIdentidadId: ['', [Validators.required]],
            numDocIdentidad: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
            fechaInscripcion: [''],
            fechaNacimiento: [''],
            estadoDjId: [''],
            apellidoPaterno: this.formBuilder.control('', Validators.required),
            apellidoMaterno: ['', [Validators.required]],
            nombres: ['', [Validators.required]],
            estadoCivil: [''],
            fallecido: [{value: '', disabled:true}, [Validators.required]],
            fechaFallecimiento: [{value: '', disabled:true}],
            razonSocial: [''],
            segContribuyenteId: [{value: '', disabled:true}],
            usuarioCreacion: ['2025'],
            terminalCreacion:['192.168.1.1'],
            municipalidadId:['1'],
        });


        this.registerFormContribuyenteDomicilio = this.formBuilder.group({

            contribuyenteId: ['', [Validators.required]],
            contribuyenteDomicilioId: ['', [Validators.required]],
            departamento: ['', [Validators.required]],
            provincia: ['', [Validators.required]],
            distrito: ['', [Validators.required]],
            tipoDomicilio: ['', [Validators.required]],
            tipoHabilitacion: ['', [Validators.required]],
            nombreHabilitacion: ['', [Validators.required]],
            tipoVia: ['', [Validators.required]],
            nombreVia: ['', [Validators.required]],
            numeroMunicipal: ['', [Validators.required]],
            loteUrbano: ['', [Validators.required]],
            numeroAlterno: ['', [Validators.required]],
            manzanaUrbana: ['', [Validators.required]],
            block: ['', [Validators.required]],
            numeroDpto: ['', [Validators.required]],
            interior: ['', [Validators.required]],
            cuadra: ['', [Validators.required]],
            kilometro: ['', [Validators.required]],
            referencia: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            usuarioRegistro: ['', [Validators.required]],
            fechaRegistro: ['', [Validators.required]],
            usuarioEdicion: ['', [Validators.required]],
            fechaEdicion: ['', [Validators.required]],

        })

        // this.registerFormContribuyenteRelacionado = this.formBuilder.group({

        //     contribuyenteId: ['', [Validators.required]],
        //     contribuyenteDomicilioId: ['', [Validators.required]],
        //     departamento: ['', [Validators.required]],
        //     provincia: ['', [Validators.required]],
        //     distrito: ['', [Validators.required]],
        //     tipoDomicilio: ['', [Validators.required]],
        //     tipoHabilitacion: ['', [Validators.required]],
        //     nombreHabilitacion: ['', [Validators.required]],
        //     tipoVia: ['', [Validators.required]],
        //     nombreVia: ['', [Validators.required]],
        //     numeroMunicipal: ['', [Validators.required]],
        //     loteUrbano: ['', [Validators.required]],
        //     numeroAlterno: ['', [Validators.required]],
        //     manzanaUrbana: ['', [Validators.required]],
        //     block: ['', [Validators.required]],
        //     numeroDpto: ['', [Validators.required]],
        //     interior: ['', [Validators.required]],
        //     cuadra: ['', [Validators.required]],
        //     kilometro: ['', [Validators.required]],
        //     referencia: ['', [Validators.required]],
        //     telefono: ['', [Validators.required]],
        //     usuarioRegistro: ['', [Validators.required]],
        //     fechaRegistro: ['', [Validators.required]],
        //     usuarioEdicion: ['', [Validators.required]],
        //     fechaEdicion: ['', [Validators.required]],
        // }
        // )
    }
    ngAfterViewInit() {
        this.maestroGenerico(3, 'maestrosMedio');
        this.maestroGenerico(2, 'maestrosTipoMedio');
        this.maestroGenerico(4, 'maestrosMotivo');
        this.maestroGenerico(12, 'maestrosModalidadOficio');
        this.maestroGenerico(14, 'maestrosTipoContribuyente');
        this.maestroGenerico(1, 'maestrosTipoDocumento');
        this.maestroGenerico(18,'maestrosEstadoDj');
        this.maestroGenerico(17,'maestrosEstadoCivil');
        this.maestroGenerico(8,'maestrosEdificacion');
        this.maestroGenerico(9,'maestrosInterior');
        this.maestroGenerico(7,'maestrosTipoVia');
    }
    onSubmit() {
        console.log('envio');
    }

    setDefaultDate() {
        this.registerFormContribuyente.patchValue({
            fechaNacimiento: moment("12/12/1995", "DD-MM-YYYY"),

        });
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


    createContribuyente() {
        console.log(this.registerFormContribuyente.value);
        this.service.guardar(this.registerFormContribuyente.value)
            .pipe(first())
            .subscribe(() => {
                Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');
                this.router.navigate(['../contribuyente/list']);
                // this.mostrarSnakbar('Registro se ha creado satisfactoriamente..!')
                //this.router.navigate(['/nsrtm-rate-payer-app'], { relativeTo: this.activatedRoute });
            })
            .add(() => this.loading = false);
    }

    public guardar(): void {
        this.setDefaultDate();
        console.log('llego');
        this.service.guardar(this.contribuyente).subscribe({
            next: (contribuyente) => {
                console.log(contribuyente);
                // alert('Contribuyente creado con exito ${contribuyente.nombres}');
                Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');
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
                    if (matriz == 'maestrosEstadoDj') {
                        console.log(matriz + 'estado dj');
                        this.maestrosEstadoDj = res;
                    }
                    if (matriz == 'maestrosEstadoCivil') {
                        console.log(matriz);
                        this.maestrosEstadoCivil = res;
                    }
                    if (matriz == 'maestrosEdificacion') {
                        console.log(matriz);
                        this.maestrosEdificacion = res;
                    }
                    if (matriz == 'maestrosInterior') {
                        console.log(matriz);
                        this.maestrosInterior = res;
                    }
                    if (matriz == 'maestrosTipoVia') {
                        console.log(matriz);
                        this.maestrosTipoVia = res;
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

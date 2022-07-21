import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contribuyente } from 'app/models/contribuyente.models';
import { Domicilio } from 'app/models/domicilio.models';
import { Relacionado } from 'app/models/relacionado.models';
import { Condicion } from 'app/models/condicion.models';
import { Maestro } from 'app/models/maestro.models';
import { UbigeoDepartamento } from 'app/models/UbigeoDepartamento.models';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { CondicionService } from 'app/services/condicion.service';
import { MaestroService } from 'app/services/maestro.service';
import { UbigeoService } from 'app/services/ubigeo.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { ubigeoProvincia } from 'app/models/ubigeoProvincia.models';
import { ubigeoDistrito } from 'app/models/ubigeoDistrito.models';
import { via } from 'app/models/via.models';
import { ViaService } from 'app/services/via.service';
import { DomicilioService } from 'app/services/domicilio.service';
import { Ubicacion } from 'app/models/ubicacion.models';

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
    maestrosTipoZonaUrbana: Maestro[] = [];
    maestrosTipoSubZona: Maestro[] = [];
    maestrosEdificacion: Maestro[] = [];
    maestrosInterior: Maestro[] = [];
    maestrosEstadoDj: Maestro[] = [];
    maestrosEstadoCivil: Maestro[] = [];
    maestrosCondicionTipoContribuyente: Maestro[] = [];
    maestrosCondicionConcursalTipo: Maestro[] = [];
    maestroEstadoRegistroCondicion: Maestro[] = [];
    maestroTipoVias: Maestro[] = [];
    maestroTipoPredio: Maestro[] = [];
    maestroTipoDomicilio: Maestro[] = [];

    ubigeo: UbigeoDepartamento[] = [];
    ubigeoProvincia: ubigeoProvincia[] = [];
    ubigeoDistrito: ubigeoDistrito[] = [];
    listaVias: via[] = [];
    listaZonas: Ubicacion[] = [];
    listaSubZona: Ubicacion[] = [];
    listaNombreEdificacion: Ubicacion[] = [];
    //Condición
    valorDepartamento: number;
    valorProvincia: number;
    valorDistrito: number;
    valorTipoVia: number;
    valorTipoZonaUrbana: number;
    valorTipoSubZonaUrbana: number;
    valorTipoEdificacion: number;

    maestrosCondicionContribuyente: Maestro[] = [];

    panelContribuyenteOpenState = false;
    panelDomicilioFiscal = false;
    panelContribuyenteRelacionadoOpenState = false;
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


    selectedFood1: string;
    selectedFood2: string;

    isAddMode!: boolean;
    loading = false;
    submitted = false;

    CondicionRegistro = false;

    constructor(private service: ContribuyenteService,
        private router: Router,
        private route: ActivatedRoute, private serviceMaestro: MaestroService,
        private formBuilder: FormBuilder,
        private serviceCondicion: CondicionService,
        private serviceUbigeo: UbigeoService,
        private serviceVia: ViaService,
        private serviceDomicilio: DomicilioService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id: number = +params.get('id');
            console.log(id + 'nuevo request');
            if (id) {
                this.service.ver(id).subscribe(contribuyente => this.contribuyente = contribuyente);
            }
        })

        this.maestroDepartamento();



        console.log(this.ubigeo);
        console.log('llego ahora ok');

        //this.registerFormContribuyente.get('fallecido').disable();
        // this.registerFormContribuyente = this.formBuilder.group({
        //     name: new FormControl({ value: '', disabled: this.disabled })
        // });
        //this.panelContribuyenteOpenState>= true;
        this.registerFormContribuyente = this.formBuilder.group({
            codContribuyente: [{ value: '', disabled: true }],
            nroDeclaracion: [{ value: '', disabled: true }],
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
            fallecido: [{ value: '', disabled: true }, [Validators.required]],
            fechaFallecimiento: [{ value: '', disabled: true }],
            razonSocial: [''],
            segContribuyenteId: [{ value: '', disabled: true }],
            usuarioCreacion: ['2025'],
            terminalCreacion: ['192.168.1.1'],
            municipalidadId: ['1'],
        });

        this.registerFormContribuyenteCondicion = this.formBuilder.group({

            //tipoCondicionInafectacionId para contribuyente y tipoCondicionInafectacion null o cer tomaria el otro campo
            tipoCondicionInafectacionId: ['', [Validators.required]],
            tipoCondicionConcursalId: [{ value: '0' }, [Validators.required]],
            tipoDocumentoId: ['', [Validators.required]],
            // nombreDocumento: ['', [Validators.required]],
            desDocumento: ['', [Validators.required]],
            numeroDocumento: ['', [Validators.required]],
            fechaDocumento: ['', [Validators.required]],
            fechaVigenciaInicial: ['', [Validators.required]],
            fechaVigenciaFinal: ['', [Validators.required]],
            importePension: ['', [Validators.required]],
            estadoId: ['', [Validators.required]],
            numeroLicencia: ['', [Validators.required]],
            numeroExpediente: ['', [Validators.required]],
            fechaExpediente: ['', [Validators.required]],
            usuarioCreacion: ['2025'],
            terminalCreacion: ['192.168.1.1'],
            municipalidadId: ['1'],
            "contribuyenteNumero": "5",
            "conContribuyenteId": null,

        });

        this.registerFormContribuyenteDomicilio = this.formBuilder.group({
            municipalidadId: ['1'],
            contribuyenteNumero: "5",
            domContribuyenteDomicilioNumero: ['', [Validators.required]],
            departamentoId: ['', [Validators.required]],
            provinciaId: ['', [Validators.required]],
            distritoId: ['', [Validators.required]],
            tipoPredioId: ['', [Validators.required]],
            viaDepartamentoId: ['', [Validators.required]],
            fechaDeclaracion: ['', [Validators.required]],
            tipoViaId: ['', [Validators.required]],
            viaId: ['', [Validators.required]],
            numero1: ['', [Validators.required]],
            letra1: ['', [Validators.required]],
            numero2: ['', [Validators.required]],
            letra2: ['', [Validators.required]],
            manzana: ['', [Validators.required]],
            lote: ['', [Validators.required]],
            subLote: ['', [Validators.required]],
            zonaUrbanaId: ['', [Validators.required]],
            nombreZonaUrbana: ['', [Validators.required]],
            subZonaUrbanaId: ['', [Validators.required]],
            nombreSubZonaUrbana: ['', [Validators.required]],
            edificacionId: ['', [Validators.required]],
            nombreEdificacion: ['', [Validators.required]],
            tipoInteriorId: ['', [Validators.required]],
            ingreso: ['', [Validators.required]],
            piso: ['', [Validators.required]],
            kilometro: ['', [Validators.required]],
            referencia: ['', [Validators.required]],
            latitud: ['', [Validators.required]],
            longitud: ['', [Validators.required]],
            usuarioRegistro: ['', [Validators.required]],
            fechaRegistro: ['', [Validators.required]],
            usuarioEdicion: ['', [Validators.required]],
            fechaEdicion: ['', [Validators.required]],
            usuarioCreacion: ['2025'],
            terminalCreacion: ['192.168.1.1'],


        });

        this.registerFormContribuyenteRelacionado = this.formBuilder.group({

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
         }
        );



        // this.registerFormContacto = this.formBuilder.group({

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
        this.maestroGenerico(3, 'maestrosMedio', 0);
        this.maestroGenerico(2, 'maestrosTipoMedio', 0);
        this.maestroGenerico(4, 'maestrosMotivo', 0);
        this.maestroGenerico(12, 'maestrosModalidadOficio', 0);
        this.maestroGenerico(14, 'maestrosTipoContribuyente', 0);
        this.maestroGenerico(1, 'maestrosTipoDocumento', 0);
        this.maestroGenerico(19, 'maestrosEstadoDj', 0);
        this.maestroGenerico(17, 'maestrosEstadoCivil', 0);
        this.maestroGenerico(8, 'maestrosEdificacion', 0);
        this.maestroGenerico(9, 'maestrosInterior', 0);
        this.maestroGenerico(7, 'maestrosTipoVia', 0);
        this.maestroGenerico(5, 'maestrosCondicionTipoContribuyente', 1);
        this.maestroGenerico(6, 'maestrosCondicionConcursalTipo', 1);
        this.maestroGenerico(20, 'maestroEstadoRegistroCondicion', 0)
        this.maestroGenerico(21, 'maestroTipoVias', 0);
        this.maestroGenerico(22, 'maestrosTipoZonaUrbana', 0);
        this.maestroGenerico(23, 'maestrosTipoSubZona', 0);
        this.maestroGenerico(13, 'maestroTipoPredio', 0);
    }


    // this.serviceUbigeo.todos().subscribe(p => this.ubigeo = p);

    maestroDepartamento() {
        // this.ubigeoProvincia = [];
        // this.ubigeo = [];
        this.serviceUbigeo.todos()
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    // matriz = res;

                    this.ubigeo = res;
                    console.log(this.ubigeo);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de Departamento');
                }
            });
    }


    maestroProvincia(departamentoId: any) {
        console.log(departamentoId + 'depa llego');
        this.serviceUbigeo.verProvincia(departamentoId)
            .subscribe({
                next: (res: any) => {
                    console.log('Provincia limpio', res);
                    // matriz = res;

                    this.ubigeoProvincia = res;
                    console.log(this.ubigeoProvincia);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de Provincia');
                }
            });
    }



    maestroDistrito(provinciaId: any) {

        this.valorDepartamento = this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        console.log(this.valorDepartamento + 'DEPARTAMENTO(1)');
        console.log(provinciaId + 'DEPARTAMENTO(2)');


        this.serviceUbigeo.verDistrito(this.valorDepartamento, provinciaId)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    // matriz = res;
                    // this.ubigeoDistrito = [];
                    this.ubigeoDistrito = res;
                    console.log(this.ubigeoDistrito);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de Distrito');
                }
            });
    }



    listarVias(tipoViaId: any) {

        this.valorDepartamento = this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        this.valorProvincia = this.registerFormContribuyenteDomicilio.controls['provinciaId'].value;
        this.valorDistrito = this.registerFormContribuyenteDomicilio.controls['distritoId'].value;
        this.valorTipoVia = tipoViaId;

        console.log(this.valorDepartamento, 'depa', this.valorProvincia, 'provincia', this.valorDistrito, 'distrito', this.valorTipoVia, 'valorTipovia');

        this.serviceVia.listarVias(this.valorDepartamento, this.valorProvincia, this.valorDistrito, this.valorTipoVia)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    this.listaVias = res;
                    console.log(this.listaVias);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de listar vias');
                }
            });
    }


    listarNombreZonaUrbana(tipoZonaUrbana: any) {

        this.valorDepartamento = this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        this.valorProvincia = this.registerFormContribuyenteDomicilio.controls['provinciaId'].value;
        this.valorDistrito = this.registerFormContribuyenteDomicilio.controls['distritoId'].value;
        this.valorTipoZonaUrbana = tipoZonaUrbana;
        console.log(this.valorDepartamento, 'depa', this.valorProvincia, 'provincia', this.valorDistrito, 'distrito', this.valorTipoZonaUrbana, 'tipozonaurbana');

        this.serviceVia.listarZona(this.valorDepartamento, this.valorProvincia, this.valorDistrito, this.valorTipoZonaUrbana)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    this.listarNombreZonaUrbana = res;
                    console.log(this.listarNombreZonaUrbana);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de listar vias');
                }
            });

    }




    listarSubZonaUrbana(SubZonaUrbana: any) {

        this.valorDepartamento = this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        this.valorProvincia = this.registerFormContribuyenteDomicilio.controls['provinciaId'].value;
        this.valorDistrito = this.registerFormContribuyenteDomicilio.controls['distritoId'].value;
        this.valorTipoSubZonaUrbana = SubZonaUrbana;
        console.log(this.valorDepartamento, 'depa', this.valorProvincia, 'provincia', this.valorDistrito, 'distrito', this.valorTipoZonaUrbana, 'tipozonaurbana');

        this.serviceVia.listarSubZona(this.valorDepartamento, this.valorProvincia, this.valorDistrito, this.valorTipoSubZonaUrbana)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    this.listaSubZona = res;
                    console.log(this.listaSubZona);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de Sub Zona');
                }
            });
    }


    listarEdificaciones(tipoEdificacion: any) {

        this.valorDepartamento = this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        this.valorProvincia = this.registerFormContribuyenteDomicilio.controls['provinciaId'].value;
        this.valorDistrito = this.registerFormContribuyenteDomicilio.controls['distritoId'].value;
        this.valorTipoEdificacion = tipoEdificacion;
        console.log(this.valorDepartamento, 'depa', this.valorProvincia, 'provincia', this.valorDistrito, 'distrito', this.valorTipoEdificacion, 'valorTipoEdificacion');

        this.serviceVia.listarEdificacion(this.valorDepartamento, this.valorProvincia, this.valorDistrito, this.valorTipoEdificacion)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    this.listaNombreEdificacion = res;
                    console.log(this.listaNombreEdificacion);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de Edificacion');
                }
            });
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
        console.log(this.registerFormContribuyenteDomicilio.value);
        this.service.guardar(this.registerFormContribuyenteDomicilio.value)
            .pipe(first())
            .subscribe(() => {
                Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');
                //this.router.navigate(['../contribuyente/list']);
                // this.mostrarSnakbar('Registro se ha creado satisfactoriamente..!')
                //this.router.navigate(['/nsrtm-rate-payer-app'], { relativeTo: this.activatedRoute });
            })
            .add(() => this.loading = false);
    }





    createDomicilioContribuyente() {
        console.log(this.registerFormContribuyenteDomicilio.value);
        this.serviceDomicilio.guardar(this.registerFormContribuyenteDomicilio.value)
            .pipe(first())
            .subscribe(() => {
                Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');
                //this.router.navigate(['../contribuyente/list']);
                // this.mostrarSnakbar('Registro se ha creado satisfactoriamente..!')
                //this.router.navigate(['/nsrtm-rate-payer-app'], { relativeTo: this.activatedRoute });
            })
            .add(() => this.loading = false);
    }



    createCondicionContribuyente() {
        console.log(this.registerFormContribuyenteCondicion.value);
        this.serviceCondicion.guardar(this.registerFormContribuyenteCondicion.value)
            .pipe(first())
            .subscribe(() => {
                Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');
                this.router.navigate(['../contribuyente/list']);
                // this.mostrarSnakbar('Registro se ha creado satisfactoriamente..!')
                //this.router.navigate(['/nsrtm-rate-payer-app'], { relativeTo: this.activatedRoute });
            })
            .add(() => this.loading = false);
    }

    createContribuyenteRelacionado() {
        // console.log(this.registerFormContribuyenteRelacionado.value);
        // this.service.crearRelacionado(this.registerFormContribuyenteRelacionado.value)
        //     .pipe(first())
        //     .subscribe(() => {
        //         Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');
        //         this.router.navigate(['../contribuyente/list']);

        //     })
        //     .add(() => this.loading = false);
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




    maestroGenerico(tipo: number, matriz: string, municipalidadId: number) {

        this.serviceMaestro.ver(tipo, municipalidadId)
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
                    if (matriz == 'maestrosCondicionTipoContribuyente') {
                        console.log(matriz);
                        this.maestrosCondicionTipoContribuyente = res;
                    }
                    if (matriz == 'maestrosCondicionConcursalTipo') {
                        console.log(matriz);
                        this.maestrosCondicionConcursalTipo = res;
                    }
                    if (matriz == 'maestroEstadoRegistroCondicion') {
                        console.log(matriz);
                        this.maestroEstadoRegistroCondicion = res;
                    }
                    if (matriz == 'maestroTipoVias') {
                        console.log(matriz);
                        this.maestroTipoVias = res;
                    }
                    if (matriz == 'maestrosTipoZonaUrbana') {
                        console.log(matriz);
                        this.maestrosTipoZonaUrbana = res;
                    }
                    if (matriz == 'maestrosTipoSubZona') {
                        console.log(matriz);
                        this.maestrosTipoSubZona = res;
                    }
                    if (matriz == 'maestroTipoPredio') {
                        console.log(matriz);
                        this.maestroTipoPredio = res;
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Maestro } from 'app/models/maestro.models';
import { Condicion } from 'app/models/condicion.models'
import { Domicilio } from 'app/models/domicilio.models';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { CondicionService } from 'app/services/condicion.service';
import { DomicilioService } from 'app/services/domicilio.service';
import { ContribuyenteModule } from './contribuyente.module';
import { MaestroService } from 'app/services/maestro.service';
import { Contribuyente } from 'app/models/contribuyente.models';
import { via } from 'app/models/via.models';
import { Ubicacion } from 'app/models/ubicacion.models';
import { UbigeoService } from 'app/services/ubigeo.service';
import { ViaService } from 'app/services/via.service';
import { RelacionadoService } from 'app/services/relacionado.service';
import { UbigeoDepartamento } from 'app/models/UbigeoDepartamento.models';
import { ubigeoProvincia } from 'app/models/ubigeoProvincia.models';
import { ubigeoDistrito } from 'app/models/ubigeoDistrito.models';
import { Relacionado } from 'app/models/relacionado.models';
import Swal from 'sweetalert2';
import { first } from 'rxjs';
import { relativeTimeThreshold } from 'moment';
@Component({
    selector: 'app-contribuyente-editar',
    templateUrl: './contribuyente-editar.component.html'
})
export class ContribuyenteEditarComponent implements OnInit {
    public verticalStepperForm!: FormGroup;
    contribuyente: Contribuyente = new Contribuyente();
    loading = false;
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
    maestroTipoRelacion: Maestro[] = [];
    maestroDocumentoTipo: Maestro[] = [];



    ubigeo: UbigeoDepartamento[] = [];
    ubigeoProvincia: ubigeoProvincia[] = [];
    ubigeoDistrito: ubigeoDistrito[] = [];
    listaVias: via[] = [];
    listaZonas: Ubicacion[] = [];
    listaSubZona: Ubicacion[] = [];
    listaNombreEdificacion: Ubicacion[] = [];
    listarZonaUrbana: Ubicacion[] = [];
    //Condición
    valorDepartamento: number;
    valorProvincia: number;
    valorDistrito: number;
    valorTipoVia: number;
    valorTipoZonaUrbana: number;
    valorTipoSubZonaUrbana: number;
    valorTipoEdificacion: number;

    error: any;
    idGeneral: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private contribuyenteService: ContribuyenteService,
        private formBuilder: FormBuilder,
        private serviceMaestro: MaestroService,
        private CondicionService: CondicionService,
        private DomicilioService: DomicilioService,
        private serviceUbigeo: UbigeoService,
        private serviceVia: ViaService,
        private serviceRelacionado: RelacionadoService
    ) { }

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        console.log('id', id);
        this.idGeneral = (Number)(this.activatedRoute.snapshot.paramMap.get('id'));


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
        this.maestroGenerico(10, 'maestroTipoRelacion', 0);
        this.maestroGenerico(18, 'maestroDocumentoTipo', 1);
        this.maestroDepartamento();
        //console.log(this.verticalStepperForm.get('step3').get('departamentoId').value);








        // Vertical stepper form
        this.verticalStepperForm = this.formBuilder.group({
            step1: this.formBuilder.group({
                contribuyenteNumero: [{ value: '' }],
                numeroDJ: [{ value: '' }],
                fechaDJ: [''],
                tipoMedioDeterminacionId: [''],
                medioDeterminacionId: [''],
                motivoDjId: ['', [Validators.required]],
                modalidadOficio: [''],
                tipoPersonaId: ['',],
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
            }),
            step2: this.formBuilder.group({
                //tipoCondicionInafectacionId para contribuyente y tipoCondicionInafectacion null o cer tomaria el otro campo
                tipoCondicionInafectacionId: ['', [Validators.required]],
                tipoCondicionConcursalId: ['0', [Validators.required]],
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
                usuarioModificion: ['2025']

            }),
            step3: this.formBuilder.group({
                municipalidadId: ['1'],
                contribuyenteNumero: "5",
                domContribuyenteDomicilioNumero: null,
                departamentoId: ['', [Validators.required]],
                provinciaId: ['', [Validators.required]],
                distritoId: ['', [Validators.required]],
                tipoPredioId: ['', [Validators.required]],
                viaDepartamentoId: [''],
                viaProvinciaId: [''],
                viaDistritoId: [''],
                // viaDepartamentoId: ['', [Validators.required]],
                //fechaRegistro: ['', [Validators.required]],
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
                desZonaUrbana:[''],
                tipoZonaUrbanaId: ['', [Validators.required]],
                tipoSubZonaUrbanaId: ['', [Validators.required]],
                edificacionId: ['', [Validators.required]],


                subZonaUrbanaId: ['', [Validators.required]],
                //nombreSubZonaUrbana: [''],

                //desEdificacion: ['', [Validators.required]],
                tipoInteriorId: ['', [Validators.required]],
                ingreso: ['', [Validators.required]],
                piso: ['', [Validators.required]],
                kilometro: ['', [Validators.required]],
                referencia: [''],
                latitud: ['', [Validators.required]],
                longitud: ['', [Validators.required]],
                // usuarioRegistro: [''],
                // fechaRegistro: [''],
                // usuarioEdicion: [''],
                // fechaEdicion: [''],
                usuarioCreacion: ['2025'],
                terminalCreacion: ['192.168.1.1'],
            }),
            step4: this.formBuilder.group({
                relContribuyenteNumero: ['', [Validators.required]],
                personaId: null,
                docIdentidadId: ['', [Validators.required]],
                numDocIdentidad: ['', [Validators.required]],
                apellidoPaterno: ['', [Validators.required]],
                apellidoMaterno: ['', [Validators.required]],
                nombres: ['', [Validators.required]],
                razonSocial: ['', [Validators.required]],
                //  fechaVigenciaInicial: [''],
                //  fechaVigenciaFinal: [''],
                fechaVigenciaInicialRela: ['', [Validators.required]],
                fechaVigenciaFinalRela: ['', [Validators.required]],
                //fechaDeclaracionRela: ['', [Validators.required]],
                //telefonoFijo: ['', [Validators.required]],
                // celular: ['', [Validators.required]],

                //anexo: ['', [Validators.required]],
                tipoRelacionadoId: ['', [Validators.required]],
                //fechaInscripcion: null,
                estadoId: "1",
                //estadoCivil: "1",
                //numeroMunicipal: ['', [Validators.required]],
                domicilioRelacionadoNumero: null,

                departamentoId: ['', [Validators.required]],
                provinciaId: ['', [Validators.required]],
                distritoId: ['', [Validators.required]],
                tipoPredioId: ['', [Validators.required]],
                viaDepartamentoId: ['15'],
                viaProvinciaId: ['135'],
                tipoViaId: ['', [Validators.required]],
                viaDistritoId: ['121'],
                viaId: ['', [Validators.required]],
                numero1: ['', [Validators.required]],
                letra1: ['', [Validators.required]],
                numero2: ['', [Validators.required]],
                letra2: ['', [Validators.required]],
                manzana: ['', [Validators.required]],
                lote: ['', [Validators.required]],
                subLote: ['', [Validators.required]],
                zonaUrbanaId: ['', [Validators.required]],
                subZonaUrbanaId: ['', [Validators.required]],
                tipoSubZonaUrbanaId: ['', [Validators.required]],
                tipoZonaUrbanaId: ['', [Validators.required]],
                edificacionId: ['', [Validators.required]],
                tipoInteriorId: ['', [Validators.required]],
                descripcionInterior: null,
                ingreso: ['', [Validators.required]],
                piso: ['', [Validators.required]],
                kilometro: ['', [Validators.required]],
                referencia: [''],
                //latitud: ['', [Validators.required]],
                //longitud: ['', [Validators.required]],
                //descripcionDomicilio: null,
                //estructurado: null,
                //fuenteInformacionId: null,
                usuarioCreacion: ['2025'],
                terminalCreacion: ['192.168.1.1'],
                municipalidadId: ['1'],
                "contribuyenteNumero": "5",
                "conContribuyenteId": null,


            })



        });

    }

    ngAfterViewInit() {


        this.cargarContribuyente(this.idGeneral);
        this.cargarContribuyenteCondicion(this.idGeneral);
        this.cargarContribuyenteDomicilio(this.idGeneral);
        this.cargarContribuyenteRelacionado(this.idGeneral);
        // this.maestroGenerico(3, 'maestrosMedio', 0);
        // this.maestroGenerico(2, 'maestrosTipoMedio', 0);
        // this.maestroGenerico(4, 'maestrosMotivo', 0);
        // this.maestroGenerico(12, 'maestrosModalidadOficio', 0);
        // this.maestroGenerico(14, 'maestrosTipoContribuyente', 0);
        // this.maestroGenerico(1, 'maestrosTipoDocumento', 0);
        // this.maestroGenerico(19, 'maestrosEstadoDj', 0);
        // this.maestroGenerico(17, 'maestrosEstadoCivil', 0);
        // this.maestroGenerico(8, 'maestrosEdificacion', 0);
        // this.maestroGenerico(9, 'maestrosInterior', 0);
        // this.maestroGenerico(7, 'maestrosTipoVia', 0);
        // this.maestroGenerico(5, 'maestrosCondicionTipoContribuyente', 1);
        // this.maestroGenerico(6, 'maestrosCondicionConcursalTipo', 1);
        // this.maestroGenerico(20, 'maestroEstadoRegistroCondicion', 0)
        // this.maestroGenerico(21, 'maestroTipoVias', 0);
        // this.maestroGenerico(22, 'maestrosTipoZonaUrbana', 0);
        // this.maestroGenerico(23, 'maestrosTipoSubZona', 0);
        // this.maestroGenerico(13, 'maestroTipoPredio', 0);
        // this.maestroGenerico(10, 'maestroTipoRelacion', 0);
        // this.maestroGenerico(18, 'maestroDocumentoTipo', 1);
        // this.maestroDepartamento();

        // this.maestroProvincia(0);
        // this.maestroDistrito(0);
        // this.listarNombreZonaUrbana2(0);



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
                    if (matriz == 'maestroTipoRelacion') {
                        console.log(matriz);
                        this.maestroTipoRelacion = res;
                    }
                    if (matriz == 'maestroDocumentoTipo') {
                        console.log(matriz);
                        this.maestroDocumentoTipo = res;
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


    cargarContribuyente(id: any) {
        this.contribuyenteService.obtener(1, id)
            .subscribe({
                next: (res: Contribuyente) => {
                    console.log('DATOS CONTRIBUYENTE', res);
                    // this.verticalStepperForm.patchValue(res);
                    this.verticalStepperForm.get('step1').patchValue(res);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación del Contribuyente');
                }
            });
    }


    cargarContribuyenteCondicion(id: any) {
        this.CondicionService.obtener(1, id)
            .subscribe({
                next: (res: Condicion) => {
                    console.log('DATOS DE CONDICION CONTRIBUYENTE', res);
                    // this.verticalStepperForm.patchValue(res);
                    this.verticalStepperForm.get('step2').patchValue(res);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de la condicion del Contribuyente');
                }
            });
    }


    cargarContribuyenteDomicilio(id: any) {
        this.DomicilioService.obtener(1, id)
            .subscribe({
                next: (res: Domicilio) => {
                    console.log('DATOS DOMICILIO DE CONTRIBUYENTE', res);
                    // this.verticalStepperForm.patchValue(res);

                    this.verticalStepperForm.get('step3').patchValue(res);
                    this.valorDepartamento = this.verticalStepperForm.get('step3').get('departamentoId').value;
                    console.log(this.valorDepartamento);
                    this.maestroProvincia(this.valorDepartamento);
                    this.valorProvincia = this.verticalStepperForm.get('step3').get('provinciaId').value;
                    this.maestroDistrito(this.valorProvincia);

                    this.valorTipoVia = this.verticalStepperForm.get('step3').get('tipoViaId').value;
                    this.listarVias(this.valorTipoVia);

                    this.valorTipoZonaUrbana = this.verticalStepperForm.get('step3').get('tipoZonaUrbanaId').value;
                    this.listarNombreZonaUrbana(this.valorTipoZonaUrbana);

                    this.valorTipoSubZonaUrbana = this.verticalStepperForm.get('step3').get('tipoSubZonaUrbanaId').value;
                    this.listarSubZonaUrbana(this.valorTipoSubZonaUrbana);

                    this.valorTipoEdificacion = this.verticalStepperForm.get('step3').get('edificacionId').value;
                    this.listarEdificaciones(this.valorTipoEdificacion);

                    //this.verticalStepperForm.patchValue(res);
                    //this.listarNombreZonaUrbana(0);

                    //this.listarNombreZonaUrbana2(0);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación deL domicilio del Contribuyente');
                }
            });
    }

    cargarContribuyenteRelacionado(id: any) {
        this.serviceRelacionado.obtener(1, id)
            .subscribe({
                next: (res: Relacionado) => {
                    console.log('DATOS DEl  RELACIONADO DEL CONTRIBUYENTE', res);
                    // this.verticalStepperForm.patchValue(res);
                    this.verticalStepperForm.get('step4').patchValue(res);

                    this.valorTipoZonaUrbana = this.verticalStepperForm.get('step4').get('tipoZonaUrbanaId').value;
                    this.listarNombreZonaUrbana2(this.valorTipoZonaUrbana);
                    this.valorTipoSubZonaUrbana = this.verticalStepperForm.get('step4').get('tipoSubZonaUrbanaId').value;
                    this.listarSubZonaUrbana2(this.valorTipoSubZonaUrbana);


                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación deL relacionado del Contribuyente');
                }
            });
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

        this.valorDepartamento = 15; //this.step1.get('step1')  //this.verticalStepperForm.get('step1').['departamentoId'].value;
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


    maestroDistrito2(provinciaId: any) {

        this.valorDepartamento = 15;// this.registerFormContribuyenteRelacionado.controls['departamentoId'].value;
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

        this.valorDepartamento = 15; //this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        this.valorProvincia = 135;//this.registerFormContribuyenteDomicilio.controls['provinciaId'].value;
        this.valorDistrito = 121;//this.registerFormContribuyenteDomicilio.controls['distritoId'].value;
        this.valorTipoVia = 1; //tipoViaId;

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


    listarVias2(tipoViaId: any) {

        this.valorDepartamento = 15; //this.registerFormContribuyenteRelacionado.controls['departamentoId'].value;
        this.valorProvincia = 135;//this.registerFormContribuyenteRelacionado.controls['provinciaId'].value;
        this.valorDistrito = 121;//this.registerFormContribuyenteRelacionado.controls['distritoId'].value;
        this.valorTipoVia = 1;//tipoViaId;

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

        this.valorDepartamento = 15;//this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        this.valorProvincia = 135;//this.registerFormContribuyenteDomicilio.controls['provinciaId'].value;
        this.valorDistrito = 121;//this.registerFormContribuyenteDomicilio.controls['distritoId'].value;
        this.valorTipoZonaUrbana = tipoZonaUrbana; //tipoZonaUrbana;
        console.log(this.valorDepartamento, 'depa', this.valorProvincia, 'provincia', this.valorDistrito, 'distrito', this.valorTipoZonaUrbana, 'tipozonaurbana');

        this.serviceVia.listarZona(this.valorDepartamento, this.valorProvincia, this.valorDistrito, this.valorTipoZonaUrbana)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    this.listarZonaUrbana = res;
                    console.log(this.listarZonaUrbana);



                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de listar zonas urbanas');
                }
            });

    }



    listarNombreZonaUrbana2(tipoZonaUrbana: any) {

        this.valorDepartamento = 15;//this.registerFormContribuyenteRelacionado.controls['departamentoId'].value;
        this.valorProvincia = 135; //this.registerFormContribuyenteRelacionado.controls['provinciaId'].value;
        this.valorDistrito = 121; //this.registerFormContribuyenteRelacionado.controls['distritoId'].value;
        this.valorTipoZonaUrbana = 1; //tipoZonaUrbana;
        console.log(this.valorDepartamento, 'depa', this.valorProvincia, 'provincia', this.valorDistrito, 'distrito', this.valorTipoZonaUrbana, 'tipozonaurbana');

        this.serviceVia.listarZona(this.valorDepartamento, this.valorProvincia, this.valorDistrito, this.valorTipoZonaUrbana)
            .subscribe({
                next: (res: any) => {
                    console.log('Motivo', res);
                    this.listarZonaUrbana = res;
                    console.log(this.listarZonaUrbana);
                },
                error: (error) => {
                    console.error('Error: ' + error);
                },
                complete: () => {
                    console.log('completo la recuperación de listar zonas ');
                }
            });

    }

    listarSubZonaUrbana(SubZonaUrbana: any) {

        this.valorDepartamento = 15;// this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        this.valorProvincia = 135;//this.registerFormContribuyenteDomicilio.controls['provinciaId'].value;
        this.valorDistrito = 121;//this.registerFormContribuyenteDomicilio.controls['distritoId'].value;
        this.valorTipoSubZonaUrbana = 1; //SubZonaUrbana;
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



    listarSubZonaUrbana2(SubZonaUrbana: any) {

        this.valorDepartamento = 15;//this.registerFormContribuyenteRelacionado.controls['departamentoId'].value;
        this.valorProvincia = 135;//this.registerFormContribuyenteRelacionado.controls['provinciaId'].value;
        this.valorDistrito = 121;//this.registerFormContribuyenteRelacionado.controls['distritoId'].value;
        this.valorTipoSubZonaUrbana = 1;//SubZonaUrbana;
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

        this.valorDepartamento = 15; //this.registerFormContribuyenteDomicilio.controls['departamentoId'].value;
        this.valorProvincia = 135; //this.registerFormContribuyenteDomicilio.controls['provinciaId'].value;
        this.valorDistrito = 121; //this.registerFormContribuyenteDomicilio.controls['distritoId'].value;
        this.valorTipoEdificacion = 1; //tipoEdificacion;
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

    listarEdificaciones2(tipoEdificacion: any) {

        this.valorDepartamento = 15;//this.registerFormContribuyenteRelacionado.controls['departamentoId'].value;
        this.valorProvincia = 135;//this.registerFormContribuyenteRelacionado.controls['provinciaId'].value;
        this.valorDistrito = 121;//this.registerFormContribuyenteRelacionado.controls['distritoId'].value;
        this.valorTipoEdificacion = 1; //tipoEdificacion;
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



    updateContribuyente(): void {
        this.contribuyenteService.crear(this.verticalStepperForm.get('step1').value, this.verticalStepperForm.get('step2').value, this.verticalStepperForm.get('step3').value, this.verticalStepperForm.get('step4').value).subscribe({
            next: (contribuyente) => {
                console.log(this.verticalStepperForm.get('step1').value, this.verticalStepperForm.get('step2').value, this.verticalStepperForm.get('step3').value, this.verticalStepperForm.get('step4').value);
                // alert('Contribuyente creado con exito ${contribuyente.nombres}');
                Swal.fire('Edición:', `Contribuyente actualizado con éxito`, 'success');
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



    // public contribuyenteCrear(): void {


    //     this.service.crear(this.verticalStepperForm.get('step1').value, this.verticalStepperForm.get('step2').value,this.verticalStepperForm.get('step3').value, this.verticalStepperForm.get('step4').value).subscribe({
    //         next: (contribuyente) => {
    //             console.log(contribuyente);
    //             // alert('Contribuyente creado con exito ${contribuyente.nombres}');
    //             Swal.fire('Nuevo:', `Contribuyente ${this.contribuyente.nombres} creado con éxito`, 'success');
    //             this.router.navigate(['../contribuyente/list']);
    //         }
    //         , error: (err) => {
    //             if (err.status === 400) {
    //                 this.error = err.error;
    //                 console.log(this.error);
    //             }
    //         }
    //     });
    // }


}

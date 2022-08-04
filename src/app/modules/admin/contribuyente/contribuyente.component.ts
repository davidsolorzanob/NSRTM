import { Component, OnInit, Injectable, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contribuyente } from 'app/models/contribuyente.models';
import { Domicilio } from 'app/models/domicilio.models';
import { Relacionado } from 'app/models/relacionado.models';
import { Condicion } from 'app/models/condicion.models';
import { Maestro } from 'app/models/maestro.models';
import { UbigeoDepartamento } from 'app/models/UbigeoDepartamento.models';
import { Contacto } from 'app/models/contacto.models';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { CondicionService } from 'app/services/condicion.service';
import { MaestroService } from 'app/services/maestro.service';
import { UbigeoService } from 'app/services/ubigeo.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { ubigeoProvincia } from 'app/models/ubigeoProvincia.models';
import { ubigeoDistrito } from 'app/models/ubigeoDistrito.models';
import { via } from 'app/models/via.models';
import { ViaService } from 'app/services/via.service';
import { DomicilioService } from 'app/services/domicilio.service';
import { RelacionadoService } from 'app/services/relacionado.service';
import { Ubicacion } from 'app/models/ubicacion.models';
import { MatAccordion } from '@angular/material/expansion';

const moment = _moment;

@Component({
    selector: 'app-contribuyente',
    templateUrl: './contribuyente.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 90px 90px 90px;

                @screen sm {
                    grid-template-columns: 84px 48px 40px;
                }

                @screen md {
                    grid-template-columns: 84px 84px 112px;
                }

                @screen lg {
                    grid-template-columns: 94px 94px 84px 94px 94px 94px 94px 84px 84px 84px;
                }
            }
        `]
    //encapsulation: ViewEncapsulation.None
})



export class ContribuyenteComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
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
    maestroTipoRelacion: Maestro[] = [];
    maestroDocumentoTipo: Maestro[] = [];
    maestrosTipoContacto: Maestro[] = [];
    maestrosTipoMedioContacto: Maestro[] = [];

    classContacto: Contacto[] = [];
    classDomicilio: Domicilio[] = [];
    //contacto = Contacto;

    ubigeo: UbigeoDepartamento[] = [];
    ubigeoProvincia: ubigeoProvincia[] = [];
    ubigeoDistrito: ubigeoDistrito[] = [];
    listaVias: via[] = [];
    listaZonas: Ubicacion[] = [];
    listaSubZona: Ubicacion[] = [];
    listaNombreEdificacion: Ubicacion[] = [];
    listarZonaUrbana: Ubicacion[] = [];


    // this.maestroGenerico(15, 'maestrosTipoContacto', 0);
    // this.maestroGenerico(16, 'maestrosTipoMedioContacto', 0);
    //Condición
    valorDepartamento: number;
    valorProvincia: number;
    valorDistrito: number;
    valorTipoVia: number;
    valorTipoZonaUrbana: number;
    valorTipoSubZonaUrbana: number;
    valorTipoEdificacion: number;

    maestrosCondicionContribuyente: Maestro[] = [];

    panelContribuyenteOpenState = true;
    panelDomicilioFiscal = true;
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
    public registerFormDomicilioRelacionado!: FormGroup;
    public registerFormContribuyenteCondicion!: FormGroup;
    public registerFormContribuyenteContacto!: FormGroup;


    isAddMode!: boolean;
    loading = false;
    submitted = false;

    CondicionRegistro = false;

    horizontalStepperForm: FormGroup;
    verticalStepperForm: FormGroup;

    //lessonData: Contacto[] = [];
    //  lessonData = [{ 'title': 'First Title', 'level': 'advanced' },
    //  { 'title': 'Second Title', 'level': 'intermediate' }];


    //  classContacto = [
    //     {
    //         'municipalidadId': '1',
    //         'contribuyenteNumero': null,
    //         'contactoContribuyenteId': null,
    //         'tipoMedioContactoId': '',
    //         'desTipoMedioContacto': '',
    //         'claseMedioContactoId': '',
    //         'desClaseMedioContacto': '',
    //         'desMedioContacto': '',
    //         'principal': '1',
    //         'estadoId': '1',
    //         'usuarioCreacion': '2025',
    //         'fechaCreacion': '',
    //         'terminalCreacion': '192.168.1.1',
    //         'usuarioModificacion': '',
    //         'fechaModificacion': '',
    //         'terminalModificacion': ''
    //     }
    // ];



    form = this.formBuilder.group({
        // title: new FormControl('My Title'),
        // level: new FormControl('Level 1'),
        tipoMedioContactoId: new FormControl('tipoMedioContactoId'),
        claseMedioContactoId: new FormControl('claseMedioContactoId'),
        desMedioContacto: new FormControl('desMedioContacto'),
        lessons: this.formBuilder.array([])
    });

    constructor(private service: ContribuyenteService,
        private router: Router,
        private route: ActivatedRoute, private serviceMaestro: MaestroService,
        private formBuilder: FormBuilder,
        private serviceCondicion: CondicionService,
        private serviceUbigeo: UbigeoService,
        private serviceVia: ViaService,
        private serviceDomicilio: DomicilioService,
        private serviceRelacionado: RelacionadoService) {
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


        // Vertical stepper form
        this.verticalStepperForm = this.formBuilder.group({
            step1: this.formBuilder.group({
                codContribuyente: [{ value: '', disabled: true }],
                nroDeclaracion: [{ value: '', disabled: true }],
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
            }),
            step3: this.formBuilder.group({
                municipalidadId: ['1'],
                contribuyenteNumero: "5",
                domContribuyenteDomicilioNumero: null,
                departamentoId: ['', [Validators.required]],
                provinciaId: ['', [Validators.required]],
                distritoId: ['', [Validators.required]],
                tipoPredioId: ['', [Validators.required]],
                viaDepartamentoId: ['15'],
                viaProvinciaId: ['135'],
                viaDistritoId: ['121'],
                // viaDepartamentoId: ['', [Validators.required]],
                fechaRegistro: ['', [Validators.required]],
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
                // usuarioRegistro: [''],
                // fechaRegistro: [''],
                // usuarioEdicion: [''],
                // fechaEdicion: [''],
                usuarioCreacion: ['2025'],
                terminalCreacion: ['192.168.1.1'],
            }), //otros domicilios
            step4: this.formBuilder.group({
                municipalidadId: ['1'],
                contribuyenteNumero: "5",
                domContribuyenteDomicilioNumero: null,
                departamentoId: ['', [Validators.required]],
                provinciaId: ['', [Validators.required]],
                distritoId: ['', [Validators.required]],
                tipoPredioId: ['', [Validators.required]],
                viaDepartamentoId: ['15'],
                viaProvinciaId: ['135'],
                viaDistritoId: ['121'],
                // viaDepartamentoId: ['', [Validators.required]],
                fechaRegistro2: ['', [Validators.required]],
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
                // usuarioRegistro: [''],
                // fechaRegistro: [''],
                // usuarioEdicion: [''],
                // fechaEdicion: [''],
                usuarioCreacion: ['2025'],
                terminalCreacion: ['192.168.1.1'],
            }) //Relacionado
            ,
            step5: this.formBuilder.group({
                relContribuyenteNumero: null,
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
                edificacionId: ['', [Validators.required]],
                tipoInteriorId: ['', [Validators.required]],
                descripcionInterior: null,
                ingreso: ['', [Validators.required]],
                piso: ['', [Validators.required]],
                kilometro: ['', [Validators.required]],
                referencia: ['', [Validators.required]],
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


            }),

            // step6: this.lessonData.forEach(ld => {
            //     const lform = this.formBuilder.group({
            //         tipoMedioContactoId: new FormControl(ld.title),
            //         claseMedioContactoId: new FormControl(ld.level),
            //         desMedioContacto: new FormControl(ld.title),
            //     });
            //     this.lessons.push(lform);

            step6: this.formBuilder.group({
                contribuyenteNumero: null,
                contactoContribuyenteId: null,
                tipoMedioContactoId: ['1'],
                claseMedioContactoId: ['1'],
                //desMedioContacto: ['', [Validators.required]],
                principal: "1",
                nombres: null,
                estadoId: "1",
                usuarioCreacion: ['2025'],
                terminalCreacion: ['192.168.1.1'],
                municipalidadId: ['1'],
                desTipoMedioContacto: ['', [Validators.required]],
                desClaseMedioContacto: ['', [Validators.required]],
                desMedioContacto: ['', [Validators.required]],

            })



            //   municipalidadId: number;
            //   contribuyenteNumero: number;
            //   contactoContribuyenteId: number;
            //   desTipoMedioContacto: string;
            //   claseMedioContactoId: number;
            //   desClaseMedioContacto: string;
            //   desMedioContacto: string;
            //   principal: number;
            //   estadoId: number;


        });




        // this.lessonData.forEach(ld => {
        //     const lform = this.formBuilder.group({
        //       title: new FormControl(ld.title),
        //       level : new FormControl(ld.level),
        //     });
        //     this.lessons.push(lform);
        //   });


        // this.registerFormContribuyente = this.formBuilder.group({
        //     codContribuyente: [{ value: '', disabled: true }],
        //     nroDeclaracion: [{ value: '', disabled: true }],
        //     fechaDJ: [''],
        //     tipoMedioDeterminacionId: ['', [Validators.required]],
        //     medioDeterminacionId: ['', [Validators.required]],
        //     motivoDjId: ['', [Validators.required]],
        //     modalidadOficio: [''],
        //     tipoPersonaId: ['', [Validators.required]],
        //     docIdentidadId: ['', [Validators.required]],
        //     numDocIdentidad: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
        //     fechaInscripcion: [''],
        //     fechaNacimiento: [''],
        //     estadoDjId: [''],
        //     apellidoPaterno: this.formBuilder.control('', Validators.required),
        //     apellidoMaterno: ['', [Validators.required]],
        //     nombres: ['', [Validators.required]],
        //     estadoCivil: [''],
        //     fallecido: [{ value: '', disabled: true }, [Validators.required]],
        //     fechaFallecimiento: [{ value: '', disabled: true }],
        //     razonSocial: [''],
        //     segContribuyenteId: [{ value: '', disabled: true }],
        //     usuarioCreacion: ['2025'],
        //     terminalCreacion: ['192.168.1.1'],
        //     municipalidadId: ['1'],
        // });

        // this.registerFormContribuyenteCondicion = this.formBuilder.group({

        //     //tipoCondicionInafectacionId para contribuyente y tipoCondicionInafectacion null o cer tomaria el otro campo
        //     tipoCondicionInafectacionId: ['', [Validators.required]],
        //     tipoCondicionConcursalId: [{ value: '0' }, [Validators.required]],
        //     tipoDocumentoId: ['', [Validators.required]],
        //     // nombreDocumento: ['', [Validators.required]],
        //     desDocumento: ['', [Validators.required]],
        //     numeroDocumento: ['', [Validators.required]],
        //     fechaDocumento: ['', [Validators.required]],
        //     fechaVigenciaInicial: ['', [Validators.required]],
        //     fechaVigenciaFinal: ['', [Validators.required]],
        //     importePension: ['', [Validators.required]],
        //     estadoId: ['', [Validators.required]],
        //     numeroLicencia: ['', [Validators.required]],
        //     numeroExpediente: ['', [Validators.required]],
        //     fechaExpediente: ['', [Validators.required]],
        //     usuarioCreacion: ['2025'],
        //     terminalCreacion: ['192.168.1.1'],
        //     municipalidadId: ['1'],
        //     "contribuyenteNumero": "5",
        //     "conContribuyenteId": null,

        // });

        // this.registerFormContribuyenteDomicilio = this.formBuilder.group({
        //     municipalidadId: ['1'],
        //     contribuyenteNumero: "5",
        //     domContribuyenteDomicilioNumero: ['', [Validators.required]],
        //     departamentoId: ['', [Validators.required]],
        //     provinciaId: ['', [Validators.required]],
        //     distritoId: ['', [Validators.required]],
        //     tipoPredioId: ['', [Validators.required]],
        //     viaDepartamentoId: ['', [Validators.required]],
        //     fechaDeclaracion: ['', [Validators.required]],
        //     tipoViaId: ['', [Validators.required]],
        //     viaId: ['', [Validators.required]],
        //     numero1: ['', [Validators.required]],
        //     letra1: ['', [Validators.required]],
        //     numero2: ['', [Validators.required]],
        //     letra2: ['', [Validators.required]],
        //     manzana: ['', [Validators.required]],
        //     lote: ['', [Validators.required]],
        //     subLote: ['', [Validators.required]],
        //     zonaUrbanaId: ['', [Validators.required]],
        //     nombreZonaUrbana: ['', [Validators.required]],
        //     subZonaUrbanaId: ['', [Validators.required]],
        //     nombreSubZonaUrbana: ['', [Validators.required]],
        //     edificacionId: ['', [Validators.required]],
        //     nombreEdificacion: ['', [Validators.required]],
        //     tipoInteriorId: ['', [Validators.required]],
        //     ingreso: ['', [Validators.required]],
        //     piso: ['', [Validators.required]],
        //     kilometro: ['', [Validators.required]],
        //     referencia: ['', [Validators.required]],
        //     latitud: ['', [Validators.required]],
        //     longitud: ['', [Validators.required]],
        //     usuarioRegistro: ['', [Validators.required]],
        //     fechaRegistro: ['', [Validators.required]],
        //     usuarioEdicion: ['', [Validators.required]],
        //     fechaEdicion: ['', [Validators.required]],
        //     usuarioCreacion: ['2025'],
        //     terminalCreacion: ['192.168.1.1'],

        // });

        // this.registerFormContribuyenteRelacionado = this.formBuilder.group({


        //     relContribuyenteNumero: ['', [Validators.required]],
        //     personaId: null,
        //     docIdentidadId: ['', [Validators.required]],
        //     numDocIdentidad: ['', [Validators.required]],
        //     apellidoPaterno: ['', [Validators.required]],
        //     apellidoMaterno: ['', [Validators.required]],
        //     nombres: ['', [Validators.required]],
        //     razonSocial: ['', [Validators.required]],
        //     fechaVigenciaInicial: [''],
        //     fechaVigenciaFinal: [''],
        //     fechaVigenciaInicialRela: ['', [Validators.required]],
        //     fechaVigenciaFinalRela: ['', [Validators.required]],
        //     fechaDeclaracionRela: ['', [Validators.required]],

        //     tipoRelacionadoId: ['', [Validators.required]],
        //     fechaInscripcion: null,
        //     estadoId: "1",
        //     estadoCivil: "1",
        //     numeroMunicipal: ['', [Validators.required]],


        //     domicilioRelacionadoNumero: null,
        //     departamentoId: ['', [Validators.required]],
        //     provinciaId: ['', [Validators.required]],
        //     distritoId: ['', [Validators.required]],
        //     tipoPredioId: ['', [Validators.required]],
        //     viaDepartamentoId: ['15'],
        //     viaProvinciaId: ['135'],
        //     tipoViaId: ['', [Validators.required]],
        //     viaDistritoId: ['121'],
        //     viaId: ['', [Validators.required]],
        //     numero1: ['', [Validators.required]],
        //     letra1: ['', [Validators.required]],
        //     numero2: ['', [Validators.required]],
        //     letra2: ['', [Validators.required]],
        //     manzana: ['', [Validators.required]],
        //     lote: ['', [Validators.required]],
        //     subLote: ['', [Validators.required]],
        //     zonaUrbanaId: ['', [Validators.required]],
        //     subZonaUrbanaId: ['', [Validators.required]],
        //     edificacionId: ['', [Validators.required]],
        //     tipoInteriorId: ['', [Validators.required]],
        //     descripcionInterior: null,
        //     ingreso: ['', [Validators.required]],
        //     piso: ['', [Validators.required]],
        //     kilometro: ['', [Validators.required]],
        //     referencia: ['', [Validators.required]],
        //     //latitud: ['', [Validators.required]],
        //     //longitud: ['', [Validators.required]],
        //     descripcionDomicilio: null,
        //     estructurado: null,
        //     fuenteInformacionId: null,
        //     usuarioCreacion: ['2025'],
        //     terminalCreacion: ['192.168.1.1'],
        //     municipalidadId: ['1'],
        //     "contribuyenteNumero": "5",
        //     "conContribuyenteId": null,


        // }
        // );



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

    // get lessons() {
    //     return this.form.controls["lessons"] as FormArray;
    // }

    // addLesson() {
    //     const lessonForm = this.formBuilder.group({
    //         tipoMedioContactoId: ['', Validators.required],
    //         claseMedioContactoId: ['', Validators.required],
    //         desMedioContacto: ['', Validators.required]
    //     });
    //     this.lessons.push(lessonForm);

    // }

    // deleteLesson(lessonIndex: number) {
    //     this.lessons.removeAt(lessonIndex);
    // }

    eliminarContacto(lessonIndex: number) {
        console.log(lessonIndex);
        this.classContacto.splice(lessonIndex, 1);
    }

    eliminarDomicilio(lessonIndex: number) {
        console.log(lessonIndex);
        this.classDomicilio.splice(lessonIndex, 1);
    }



    addDomicilio(){

        console.log(this.verticalStepperForm.get('step4').value);
        this.classDomicilio.push(this.verticalStepperForm.get('step4').value);
        this.verticalStepperForm.get('step4').reset();
        console.log(this.classDomicilio);

    }


    addContacto() {
        //    const nuevoContacto = [{

        //     'municipalidadId': '1',
        //     'contribuyenteNumero': null,
        //     'contactoContribuyenteId': null,
        //     'tipoMedioContactoId': '',
        //     'desTipoMedioContacto': '',
        //     'claseMedioContactoId': '',
        //     'desClaseMedioContacto': '',
        //     'desMedioContacto': '',
        //     'principal': '1',
        //     'estadoId': '1',
        //     'usuarioCreacion': '2025',
        //     'fechaCreacion': '',
        //     'terminalCreacion': '192.168.1.1',
        //     'usuarioModificacion': '',
        //     'fechaModificacion': '',
        //     'terminalModificacion': ''

        //    }];
        //this.verticalStepperForm.get('step6').value
        //  const contactForm = Contac

        //classContacto: Contacto[]=[];
        //contacto = Contacto;

        //const Con = this.contacto;
        //this.Con =

        console.log(this.verticalStepperForm.get('step6').value);
        //({
        //     contribuyenteNumero: null,
        //     contactoContribuyenteId: null,
        //     tipoMedioContactoId: "1", //['', [Validators.required]],
        //     claseMedioContactoId: "1", //['', [Validators.required]],
        //     desMedioContacto: "456152787", //['', [Validators.required]],
        //     principal: "1",
        //     nombres: null,
        //     estadoId: "1",
        //     usuarioCreacion: ['2025'],
        //     terminalCreacion: ['192.168.1.1'],
        //     municipalidadId: ['1'],

        // })

        this.classContacto.push(this.verticalStepperForm.get('step6').value);

        this.verticalStepperForm.get('step6').reset();
        console.log(this.classContacto);
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
        this.maestroGenerico(10, 'maestroTipoRelacion', 0);
        this.maestroGenerico(18, 'maestroDocumentoTipo', 1);
        this.maestroGenerico(15, 'maestrosTipoContacto', 0);
        this.maestroGenerico(16, 'maestrosTipoMedioContacto', 0);

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
        this.serviceUbigeo.verProvincia(15)
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

        this.serviceUbigeo.verDistrito(this.valorDepartamento, 135)
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


        this.serviceUbigeo.verDistrito(this.valorDepartamento, 135)
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
    onSubmit() {
        console.log('envio');
    }

    setDefaultDate() {
        this.registerFormContribuyente.patchValue({
            fechaNacimiento: moment("12/12/1995", "DD-MM-YYYY"),

        });
    }

    public contribuyenteCrear(): void {


        this.service.crear(this.verticalStepperForm.get('step1').value, this.verticalStepperForm.get('step2').value, this.verticalStepperForm.get('step3').value, this.verticalStepperForm.get('step5').value, this.classContacto).subscribe({
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

    ///-------------------------------------------------------------------------------------------------
    ///--------Registro de los Formularios--------------------------------------------------------------


    //1) Create Contriuyente
    createContribuyente() {
        console.log(this.registerFormContribuyente.value);
        this.service.guardar(this.registerFormContribuyente.value)
            .pipe(first())
            .subscribe(() => {
                Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');

                //this.router.navigate(['../contribuyente/list']);
                // this.mostrarSnakbar('Registro se ha creado satisfactoriamente..!')
                //this.router.navigate(['/nsrtm-rate-payer-app'], { relativeTo: this.activatedRoute });
            })
            .add(() => this.loading = false);
    }



    //2) Create Contribuyente Domicilio
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


    // 3) Create Contribuyente Condicion
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

    // 4)  Create Contribuyente Relacionado
    createContribuyenteRelacionado() {

        //     this.valorDepartamento = this.registerFormContribuyenteRelacionado.controls['departamentoId'].value;
        //     this.valorProvincia = this.registerFormContribuyenteRelacionado.controls['provinciaId'].value;
        //     this.valorDistrito = this.registerFormContribuyenteRelacionado.controls['distritoId'].value;

        //   this.registerFormContribuyenteRelacionado.controls['viaDepartamentoId'].value = this.valorDepartamento;


        console.log(this.registerFormContribuyenteRelacionado.value);
        this.serviceRelacionado.guardar(this.registerFormContribuyenteRelacionado.value)
            .pipe(first())
            .subscribe(() => {
                Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');
                this.router.navigate(['../contribuyente/list']);

            })
            .add(() => this.loading = false);
    }

    // 5) Guardar Todo






    ///-------Fin


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


    ///-------------------------------------------------------------------------------------------------
    ///-------------------------------------------------------------------------------------------------

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





    public guardarTodo(): void {

        console.log('llego Guardar Todo');
        this.service.guardar(this.contribuyente).subscribe({
            next: (contribuyente) => {
                console.log(contribuyente);
                // alert('Contribuyente creado con exito ${contribuyente.nombres}');
                //Swal.fire('Nuevo:', `Registro se ha creado satisfactoriamente`, 'success');
                //this.router.navigate(['../contribuyente/list']);
            }
            , error: (err) => {
                if (err.status === 400) {
                    this.error = err.error;
                    console.log(this.error);
                }
            }
        });





    }



    public clickAddTodo() {

        console.log('ok llego todo');
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
                    if (matriz == 'maestrosTipoContacto') {
                        console.log(matriz);
                        this.maestrosTipoContacto = res;
                    }
                    if (matriz == 'maestrosTipoMedioContacto') {
                        console.log(matriz);
                        this.maestrosTipoMedioContacto = res;
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

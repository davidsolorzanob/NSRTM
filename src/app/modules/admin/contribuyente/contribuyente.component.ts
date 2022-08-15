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
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

    //contadores de listas temporales

    countClassContacto: number = 0;
    indexClassContacto: number = -1;
    indexClassDomicilio: number = -1;

    ModoEdicionContacto = 0;
    ModoEdicionDomicilio = 0;

    contribuyentes: Contribuyente[];
    maestrosTipoMedio: Maestro[] = [];
    maestrosMedio: Maestro[] = [];
    maestrosMotivo: Maestro[] = [];
    maestrosModalidadOficio: Maestro[] = [];
    maestrosTipoContribuyente: Maestro[] = [];
    maestrosTipoDocumento: Maestro[] = [];

    //Session

    muniId = "1";
    terminal = "192.138.120.142";
    userCreacion = "2025";
    sessionDepartamento = 15;
    sessionProvincia = 135;
    sessionDistrito = 121;
    sessionTipoPredio = 1;
    sessionModalidadOficio = 1;

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
    maestroTipoPredio_Fiscal: Maestro[] = [];
    maestroTipoPredio_Sin_Fiscal: Maestro[] = [];
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

    //Condición
    valorDepartamento: number;
    valorProvincia: number;
    valorDistrito: number;
    valorTipoVia: number;
    valorTipoZonaUrbana: number;
    valorTipoSubZonaUrbana: number;
    valorTipoEdificacion: number;
    msgTipoDocumento: string;

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
    public registerFormTemp!: FormGroup;

    isAddMode!: boolean;
    loading = false;
    submitted = false;

    CondicionRegistro = false;

    horizontalStepperForm: FormGroup;
    verticalStepperForm: FormGroup;

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
        this.maestroProvincia(this.sessionDepartamento);
        this.maestroDistrito(this.sessionProvincia);

        console.log(this.ubigeo);
        console.log('llego ahora ok');
        // const  validPattern = "^[a-zA-Z0-9]{10}$"; // alphanumeric exact 10 letters

        // unamePattern = "^[a-z0-9_-]{8, 15}$" ;
        // pwdPattern = "^(?=.*\d)(?=.*[az])(?=.*[AZ])(?!.*\s).{6,12}$" ;
        // mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$" ;
        // emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[az]{2,4}$" ;


        // Vertical stepper form
        this.verticalStepperForm = this.formBuilder.group({
            step1: this.formBuilder.group({
                contribuyenteNumero: [{ value: '', disabled: true }],
                nroDeclaracion: [{ value: '', disabled: true }],
                fechaDJ: [''],
                tipoMedioDeterminacionId: ['', [Validators.required]],
                medioDeterminacionId: ['', [Validators.required]],
                motivoDjId: ['', [Validators.required]],
                modalidadOficio: [[{ value: '', disabled: true }]],
                tipoPersonaId: ['', [Validators.required]],
                docIdentidadId: ['', [Validators.required]],
                numDocIdentidad: ['', [Validators.required]],
                fechaInscripcion: [''],
                fechaNacimiento: [''],
                estadoDjId: [''],
                apellidoPaterno: ['', [Validators.required]],
                apellidoMaterno: ['', [Validators.required]],
                nombres: ['', [Validators.required]],
                estadoCivil: ['', [Validators.required]],
                fallecido: [{ value: '', disabled: true }, [Validators.required]],
                fechaFallecimiento: [{ value: '', disabled: true }],
                razonSocial: [''],
                segContribuyenteId: [{ value: '', disabled: true }],
                usuarioCreacion: this.userCreacion,
                terminalCreacion: this.terminal,
                municipalidadId: this.muniId,
                // "contribuyenteNumero": "5",
            }),
            step2: this.formBuilder.group({
                //tipoCondicionInafectacionId para contribuyente y tipoCondicionInafectacion null o cer tomaria el otro campo
                tipoCondicionInafectacionId: ['', [Validators.required]],
                tipoCondicionConcursalId: ['0'],
                tipoDocumentoId: [''],
                // nombreDocumento: ['', [Validators.required]],
                desDocumento: [''],
                numeroDocumento: [''],
                fechaDocumento: [''],
                fechaVigenciaInicial: [''],
                fechaVigenciaFinal: [''],
                importePension: [''],
                estadoId: [''],
                numeroLicencia: [''],
                numeroExpediente: [''],
                fechaExpediente: [''],
                usuarioCreacion: ['2025'],
                terminalCreacion: ['192.168.1.1'],
                municipalidadId: ['1'],
                // "contribuyenteNumero": "5",
                "conContribuyenteId": null,
            }),
            step3: this.formBuilder.group({
                municipalidadId: ['1'],
                domContribuyenteDomicilioNumero: null,
                departamentoId: ['', [Validators.required]],
                provinciaId: ['', [Validators.required]],
                distritoId: ['', [Validators.required]],
                tipoPredioId: ['', [Validators.required]],
                descripcionDepartamentoId: [''],
                descripcionProvinciaId: [''],
                descripcionDistritoId: [''],
                viaDepartamentoId: ['15'],
                viaProvinciaId: ['135'],
                viaDistritoId: ['121'],
                fechaRegistro: ['', [Validators.required]],
                tipoViaId: ['', [Validators.required]],
                desTipoPredioId: '',
                viaId: ['', [Validators.required]],  // buscador SELECT 2
                numero1: ['', [Validators.maxLength(5)]],
                letra1: ['', [Validators.maxLength(5)]],
                numero2: ['', [Validators.maxLength(6)]],
                letra2: ['', [Validators.maxLength(6)]],
                manzana: ['', [Validators.maxLength(6)]],
                lote: ['', [Validators.maxLength(6)]],
                subLote: ['', [Validators.maxLength(6)]],
                zonaUrbanaId: [''], // buscador SELECT 2
                nombreZonaUrbana: [''],
                subZonaUrbanaId: [''],  // buscador SELECT 2
                nombreSubZonaUrbana: [''],
                edificacionId: [''],  // buscador SELECT 2
                nombreEdificacion: [''],
                tipoInteriorId: [''], // buscador SELECT 2
                ingreso: ['', [Validators.maxLength(6)]],
                piso: ['', [Validators.maxLength(6)]],
                kilometro: ['', [Validators.maxLength(6)]],
                referencia: ['', [Validators.maxLength(100)]],
                latitud: [''],
                longitud: [''],
                usuarioCreacion: ['2025'],
                terminalCreacion: ['192.168.1.1'],
            }), //otros domicilios
            step4: this.formBuilder.group({
                municipalidadId: this.muniId,
                domContribuyenteDomicilioNumero: null,
                departamentoId: ['', [Validators.required]],
                provinciaId: ['', [Validators.required]],
                distritoId: ['', [Validators.required]],
                tipoPredioId: ['', [Validators.required]],
                descripcionDepartamentoId: [''],
                descripcionProvinciaId: [''],
                descripcionDistritoId: [''],
                viaDepartamentoId: ['15'],
                viaProvinciaId: ['135'],
                viaDistritoId: ['121'],
                fechaRegistro: ['', [Validators.required]],
                tipoViaId: ['', [Validators.required]],
                desTipoPredioId: '',
                viaId: ['', [Validators.required]],
                numero1: [''],
                letra1: [''],
                numero2: [''],
                letra2: [''],
                manzana: [''],
                lote: [''],
                subLote: [''],
                zonaUrbanaId: [''],
                nombreZonaUrbana: [''],
                subZonaUrbanaId: [''],
                nombreSubZonaUrbana: [''],
                edificacionId: [''],
                nombreEdificacion: [''],
                tipoInteriorId: [''],
                ingreso: [''],
                piso: [''],
                kilometro: [''],
                referencia: [''],
                latitud: [''],
                longitud: [''],
                usuarioCreacion: this.userCreacion,
                terminalCreacion: this.terminal,
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
                razonSocial: [''],
                fechaVigenciaInicialRela: ['', [Validators.required]],
                fechaVigenciaFinalRela: [''],
                tipoRelacionadoId: ['', [Validators.required]],
                estadoId: "1",
                domicilioRelacionadoNumero: null,
                departamentoId: ['', [Validators.required]],
                provinciaId: ['', [Validators.required]],
                distritoId: ['', [Validators.required]],
                tipoPredioId: ['', [Validators.required]],
                desTipoPredioId: '',
                viaDepartamentoId: ['15'],
                viaProvinciaId: ['135'],
                tipoViaId: ['', [Validators.required]],
                viaDistritoId: ['121'],
                viaId: [''],
                numero1: [''],
                letra1: [''],
                numero2: [''],
                letra2: [''],
                manzana: [''],
                lote: [''],
                subLote: [''],
                zonaUrbanaId: [''],
                subZonaUrbanaId: [''],
                edificacionId: [''],
                tipoInteriorId: [''],
                descripcionInterior: null,
                ingreso: [''],
                piso: [''],
                kilometro: [''],
                referencia: [''],
                usuarioCreacion: ['2025'],
                terminalCreacion: ['192.168.1.1'],
                municipalidadId: ['1'],
                "conContribuyenteId": null,
            }),


            step6: this.formBuilder.group({
                //contribuyenteNumero: null,
                contactoContribuyenteId: null,
                tipoMedioContactoId: ['', [Validators.required]],
                claseMedioContactoId: ['', [Validators.required]],
                //desMedioContacto: ['', [Validators.required]],

                desTipoMedioContacto: ['', [Validators.required]],
                desClaseMedioContacto: ['', [Validators.required]],


                principal: "1",
                //  nombres: null,
                estadoId: "1",
                usuarioCreacion: this.userCreacion,
                terminalCreacion: this.terminal,
                municipalidadId: this.muniId,

                // desTipoMedioContacto: ['', [Validators.required]],
                //desClaseMedioContacto: ['', [Validators.required]],
                desMedioContacto: ['', [Validators.required]],

            })

        });

    }

    validacionTipoDocumento(evento: number) {
        if (evento == 1) {
            console.log(evento);
            this.verticalStepperForm.get('step1').get('numDocIdentidad').setValidators(Validators.pattern('^[0-9]{8}$'));
            this.msgTipoDocumento = 'El DNI debe ser de 8 digitos y solo números';
        }
        if (evento == 2) {
            console.log(evento);
            this.verticalStepperForm.get('step1').get('numDocIdentidad').setValidators(Validators.pattern('^[0-9]{11}$'));
            this.msgTipoDocumento = 'El RUC debe ser de 11 digitos y solo números';
            this.verticalStepperForm.get('step1').get('razonSocial').setValidators(Validators.required);

        }
        if (evento == 3) {
            console.log(evento);
            this.verticalStepperForm.get('step1').get('numDocIdentidad').setValidators(Validators.pattern('^[a-zA-Z0-9]{20}'));
            this.msgTipoDocumento = 'El PASAPORTE debe ser de 20 digitos';
        }
        if (evento == 4) {
            console.log(evento);
            this.verticalStepperForm.get('step1').get('numDocIdentidad').setValidators(Validators.pattern('^[a-zA-Z0-9]{20}'));
            this.msgTipoDocumento = 'El Carnet de Extranjería debe ser de 20 digitos';
        }

    }


    validacionTipoContribuyente(evento: number) {
        if (evento == 0) {
            console.log(evento);
            // this.verticalStepperForm.get('step2').get('numDocIdentidad').setValidators(Validators.pattern('^[0-9]{8}$'));
            // this.msgTipoDocumento = 'El DNI debe ser de 8 digitos y solo números';
            //  this.verticalStepperForm.get('step2').disabled;
            // this.verticalStepperForm.get('step2').get('tipoCondicionConcursalId').setValue({ value: '', disabled: true });
            // this.verticalStepperForm.get('step2').get('tipoDocumentoId').disable;
            // this.verticalStepperForm.get('step2').get('numeroDocumento').disable;
            // this.verticalStepperForm.get('step2').get('fechaDocumento').disable;
            // this.verticalStepperForm.get('step2').get('fechaVigenciaInicial').disable;
            // this.verticalStepperForm.get('step2').get('fechaVigenciaFinal').disable;
          // this.verticalStepperForm.get('step2').get('importePension').setValidators([{  disabled: true }]);
            // this.verticalStepperForm.get('step2').get('estadoId').disable;
            // this.verticalStepperForm.get('step2').get('numeroLicencia').disable;
            // this.verticalStepperForm.get('step2').get('numeroExpediente').disable;
            // this.verticalStepperForm.get('step2').get('fechaExpediente').disable;
            // tipoCondicionConcursalId: ['0'],
            // tipoDocumentoId: [''],
            // // nombreDocumento: ['', [Validators.required]],
            // desDocumento: [''],
            // numeroDocumento:[''],
            // fechaDocumento: [''],
            // fechaVigenciaInicial:[''],
            // fechaVigenciaFinal: [''],
            // importePension: [''],
            // estadoId: [''],
            // numeroLicencia: [''],
            // numeroExpediente: [''],
            // fechaExpediente: [''],
        }
        else {
            console.log(evento);
            this.verticalStepperForm.get('step2').get('tipoCondicionConcursalId').setValidators(Validators.required);
            this.verticalStepperForm.get('step2').get('tipoDocumentoId').setValidators(Validators.required);
            this.verticalStepperForm.get('step2').get('numeroDocumento').setValidators(Validators.required);

        }
    }



    // Adicionar Contacto
    addContacto() {
        if (this.ModoEdicionContacto == 0) {
            this.classContacto.push(this.verticalStepperForm.get('step6').value);
            //this.verticalStepperForm.get('step6').reset();
            this.verticalStepperForm.get('step6').get('desMedioContacto').setValue("");
            console.log(this.classContacto);
        }
        else {
            this.classContacto.splice(this.indexClassContacto, 1);
            this.classContacto.splice(this.indexClassContacto, 0, this.verticalStepperForm.get('step6').value);
            this.indexClassContacto = -1;
            this.ModoEdicionContacto = 0;
        }
    }


    //       <input hidden="true"  name="descripcionDepartamentoId"
    //       id="descripcionDepartamentoId" formControlName="descripcionDepartamentoId">
    //   <input hidden="true"  name="descripcionProvinciaId"
    //       id="descripcionProvinciaId" formControlName="descripcionProvinciaId">
    //   <input  hidden="true" name="descripcionDistritoId" id="descripcionDistritoId"
    //       formControlName="descripcionDistritoId">

        this.verticalStepperForm.get('step6').get('tipoMedioContactoId').setErrors(null);
        this.verticalStepperForm.get('step6').get('claseMedioContactoId').setErrors(null);
        this.verticalStepperForm.get('step6').get('desMedioContacto').setErrors(null);

        this.verticalStepperForm.get('step6').get('tipoMedioContactoId').markAsPristine();
        this.verticalStepperForm.get('step6').get('claseMedioContactoId').markAsPristine();
        this.verticalStepperForm.get('step6').get('desMedioContacto').markAsPristine();
    }

    getUbigeo(distritoId: number) {

        let indiceDistrito = distritoId;
        let indiceDepartamento = this.verticalStepperForm.get('step4').get('departamentoId').value;
        let indiceProvincia = this.verticalStepperForm.get('step4').get('provinciaId').value;

        const filterDepartamento = this.ubigeo.filter((item) => item.departamentoId == indiceDepartamento);
        const filterProvincia = this.ubigeoProvincia.filter((item) => item.provinciaId == indiceProvincia);
        const filterDistrito = this.ubigeoDistrito.filter((item) => item.distritoId == indiceDistrito);

        console.log(indiceDepartamento);
        console.log(indiceProvincia);
        console.log(indiceDistrito);

        // let indiceDistrito = this.verticalStepperForm.get('step4').get('distritoId').value;
        // console.log(this.ubigeoDistrito[indiceDistrito].descripcion);

        indiceDistrito = indiceDistrito;
        indiceDepartamento = indiceDepartamento;
        indiceProvincia = indiceProvincia - 1;


        this.verticalStepperForm.get('step4').get('descripcionDepartamentoId').setValue(filterDepartamento[0].descripcion);
        this.verticalStepperForm.get('step4').get('descripcionProvinciaId').setValue(filterProvincia[0].descripcion);
        this.verticalStepperForm.get('step4').get('descripcionDistritoId').setValue(filterDistrito[0].descripcion);
    }






    getTipoMedioContactoId(e) {
        let tipoMedioContactoId = e;//e.value =="" ? 0 : e.value;
        console.log(tipoMedioContactoId);
        if(tipoMedioContactoId>0 || tipoMedioContactoId!=null){
            let data = this.maestrosTipoContacto.find(o => o.maestroId === tipoMedioContactoId);
                console.log(tipoMedioContactoId);
                let indice = tipoMedioContactoId - 1;
                console.log(indice);
                console.log(data);
                console.log('llego oj');
                // this.verticalStepperForm.get('step6').get('desTipoMedioContacto').setValue =  this.maestrosTipoMedioContacto[indice].descripcion;

                this.verticalStepperForm.get('step6').get('desTipoMedioContacto').setValue(data.descripcion);
                this.setValidatorDetalleStep6(tipoMedioContactoId);
        }
    }


    getClaseMedioContactoId(e) {
        let tipoClaseMedioContactoId = e.value =="" ? 0 : e.value;
        if(tipoClaseMedioContactoId>0 || tipoClaseMedioContactoId!=null){
            let data = this.maestrosTipoMedioContacto.find(o => o.maestroId === tipoClaseMedioContactoId);
            console.log(tipoClaseMedioContactoId);
            let indice = tipoClaseMedioContactoId - 1;
            console.log(indice);
            console.log(data);
            console.log('llego oj');
            // this.verticalStepperForm.get('step6').get('desTipoMedioContacto').setValue =  this.maestrosTipoMedioContacto[indice].descripcion;

            this.verticalStepperForm.get('step6').get('desClaseMedioContacto').setValue(data.descripcion);
        }
    }

    getTipoPredioId(tipoPredioId: number) {

        let indice = tipoPredioId - 1;
        this.verticalStepperForm.get('step4').get('desTipoPredioId').setValue(this.maestroTipoPredio[indice].descripcion);

    }

    //Eliminar Contacto
    eliminarContacto(lessonIndex: number) {
        this.classContacto.splice(lessonIndex, 1);
    }
    // Editar Contacto
    editContacto(lessonIndex: number, contacto: Contacto) {
        this.ModoEdicionContacto = 1
        this.verticalStepperForm.get('step6').patchValue(contacto);
        this.indexClassContacto = lessonIndex;
        this.setValidatorDetalleStep6(contacto.tipoMedioContactoId);
    }
    //Adicionar Domicilio
    addDomicilio() {
        if (this.ModoEdicionDomicilio == 0) {
            this.classDomicilio.push(this.verticalStepperForm.get('step4').value);
            //this.verticalStepperForm.get('step4').reset();


            this.verticalStepperForm.get('step4').get('departamentoId').setValue("");
            this.verticalStepperForm.get('step4').get('provinciaId').setValue("");
            this.verticalStepperForm.get('step4').get('distritoId').setValue("");
            this.verticalStepperForm.get('step4').get('tipoPredioId').setValue("");
            this.verticalStepperForm.get('step4').get('descripcionDepartamentoId').setValue("");
            this.verticalStepperForm.get('step4').get('descripcionProvinciaId').setValue("");
            this.verticalStepperForm.get('step4').get('descripcionDistritoId').setValue("");
            //this.verticalStepperForm.get('step4').get('viaDepartamentoId').setValue("");
            //this.verticalStepperForm.get('step4').get('viaProvinciaId').setValue("");
            //this.verticalStepperForm.get('step4').get('viaDistritoId').setValue("");
            this.verticalStepperForm.get('step4').get('fechaRegistro').setValue("");
            this.verticalStepperForm.get('step4').get('tipoViaId').setValue("");
            this.verticalStepperForm.get('step4').get('desTipoPredioId').setValue("");
            this.verticalStepperForm.get('step4').get('viaId').setValue("");
            this.verticalStepperForm.get('step4').get('departamentoId').setValue("");
            this.verticalStepperForm.get('step4').get('numero1').setValue("");
            this.verticalStepperForm.get('step4').get('letra1').setValue("");
            this.verticalStepperForm.get('step4').get('numero2').setValue("");
            this.verticalStepperForm.get('step4').get('letra2').setValue("");
            this.verticalStepperForm.get('step4').get('manzana').setValue("");
            this.verticalStepperForm.get('step4').get('lote').setValue("");
            this.verticalStepperForm.get('step4').get('zonaUrbanaId').setValue("");
            this.verticalStepperForm.get('step4').get('nombreZonaUrbana').setValue("");
            this.verticalStepperForm.get('step4').get('subZonaUrbanaId').setValue("");
            this.verticalStepperForm.get('step4').get('nombreSubZonaUrbana').setValue("");
            this.verticalStepperForm.get('step4').get('edificacionId').setValue("");
            this.verticalStepperForm.get('step4').get('nombreEdificacion').setValue("");
            this.verticalStepperForm.get('step4').get('subLote').setValue("");
            this.verticalStepperForm.get('step4').get('ingreso').setValue("");
            this.verticalStepperForm.get('step4').get('piso').setValue("");
            this.verticalStepperForm.get('step4').get('kilometro').setValue("");
            this.verticalStepperForm.get('step4').get('latitud').setValue("");
            this.verticalStepperForm.get('step4').get('longitud').setValue("");
            this.verticalStepperForm.get('step4').get('kilometro').setValue("");
            // this.verticalStepperForm.get('step4').get('usuarioCreacion').setValue("");
            //this.verticalStepperForm.get('step4').get('terminalCreacion').setValue("");
            console.log(this.classDomicilio);
        }
        else {
            this.classDomicilio.splice(this.indexClassDomicilio, 1);
            this.classDomicilio.splice(this.indexClassDomicilio, 0, this.verticalStepperForm.get('step4').value);
            this.indexClassDomicilio = -1;
            this.ModoEdicionDomicilio = 0;
            this.verticalStepperForm.get('step4').reset();
        }
    }
    //Eliminar Domicilio
    eliminarDomicilio(lessonIndex: number) {
        console.log(lessonIndex);
        this.classDomicilio.splice(lessonIndex, 1);
    }
    // Editar Domicilio
    editDomicilio(lessonIndex: number, domicilio: Domicilio) {
        this.ModoEdicionDomicilio = 1
        this.verticalStepperForm.get('step4').patchValue(domicilio);
        this.indexClassContacto = lessonIndex;
        console.log(domicilio);
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
        this.maestroGenerico(13, 'maestroTipoPredio_Fiscal', 0);
        this.maestroGenerico(10, 'maestroTipoRelacion', 0);
        this.maestroGenerico(18, 'maestroDocumentoTipo', 1);
        this.maestroGenerico(15, 'maestrosTipoContacto', 0);
        this.maestroGenerico(16, 'maestrosTipoMedioContacto', 0);

    }


    // this.serviceUbigeo.todos().subscribe(p => this.ubigeo = p);

    maestroDepartamento() {
        // this.ubigeoProvincia = [];
        // this.ubigeo = [];


        //let indice = provinciaId-1;
        // console.log(indice);
        // console.log(this.maestrosTipoContacto[indice].descripcion);
        // console.log('llego oj');
        // this.verticalStepperForm.get('step6').get('desTipoMedioContacto').setValue =  this.maestrosTipoMedioContacto[indice].descripcion;

        //this.verticalStepperForm.get('step4').get('descripcionProvinciaId').setValue(this.ubigeoProvincia[indice].descripcion);


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
        this.classDomicilio.push(this.verticalStepperForm.get('step3').value);
        this.service.crear(this.verticalStepperForm.get('step1').value, this.verticalStepperForm.get('step2').value, this.verticalStepperForm.get('step3').value, this.verticalStepperForm.get('step5').value, this.classContacto, this.classDomicilio).subscribe({
            next: (contribuyente) => {
                console.log(contribuyente);
                // alert('Contribuyente creado con exito ${contribuyente.nombres}');
                Swal.fire('Nuevo:', `Contribuyente creado con éxito`, 'success');
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
                Swal.fire('Editado:', `Contribuyente editado con éxito`, 'success');
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
                        console.log('maestroTipoPredio');
                        this.maestroTipoPredio = res;
                        this.maestroTipoPredio_Sin_Fiscal = this.maestroTipoPredio.filter((item) => item.descripcion != 'Fiscal');
                        this.maestroTipoPredio_Fiscal = this.maestroTipoPredio.filter((item) => item.descripcion == 'Fiscal');
                    }
                    // if (matriz == 'maestroTipoPredio_Fiscal') {
                    //     console.log(matriz);
                    //     this.maestroTipoPredio_Fiscal = res;
                    //     ///this.maestroTipoPredio_Fiscal = this.maestroTipoPredio_Fiscal.filter((item)=>item.descripcion=='Fiscal');
                    // }
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

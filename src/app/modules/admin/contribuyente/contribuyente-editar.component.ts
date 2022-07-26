import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Maestro } from 'app/models/maestro.models';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { ContribuyenteModule } from './contribuyente.module';
import { MaestroService } from 'app/services/maestro.service';
import { Contribuyente } from 'app/models/contribuyente.models';

@Component({
    selector: 'app-contribuyente-editar',
    templateUrl: './contribuyente-editar.component.html'
})
export class ContribuyenteEditarComponent implements OnInit {
    public verticalStepperForm!: FormGroup;


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




    // listaVias: via[] = [];
    // listaZonas: Ubicacion[] = [];
    // listaSubZona: Ubicacion[] = [];
    // listaNombreEdificacion: Ubicacion[] = [];
    // listarZonaUrbana: Ubicacion[] = [];
    //Condición
    valorDepartamento: number;
    valorProvincia: number;
    valorDistrito: number;
    valorTipoVia: number;
    valorTipoZonaUrbana: number;
    valorTipoSubZonaUrbana: number;
    valorTipoEdificacion: number;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private contribuyenteService: ContribuyenteService,
        private formBuilder: FormBuilder,
        private serviceMaestro: MaestroService
    ) { }

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        console.log('id', id);
        this.cargarContribuyente(id);



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


        });

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
                next: (res: ContribuyenteModule) => {
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





}

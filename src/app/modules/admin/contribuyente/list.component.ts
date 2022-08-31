import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common'
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { ContribuyenteReporte } from 'app/models/contribuyenteReporte.models';
import { Contribuyente } from 'app/models/contribuyente.models';
import { DocSustento } from 'app/models/docSustento.models';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { Activity } from 'app/modules/admin/activities/activities.types';
import { ActivitiesService } from 'app/modules/admin/activities/activities.service';
import { Observable } from 'rxjs';
import moment from 'moment';

@Component({
    selector: 'app-list',
    templateUrl: 'list.component.html',
    styles: [
        /* language=SCSS */
        `
        .inventory-grid {
            grid-template-columns: 48px 48px 40px;

            @screen sm {
                grid-template-columns: 84px 48px 40px;
            }

            @screen md {
                grid-template-columns: 84px 84px 112px;
            }

            @screen lg {
                grid-template-columns: 94px 94px 84px 384px 184px 184px 184px 84px 84px;
            }
        }
        .demo-table {
            width: 100%;
          }

          .mat-row .mat-cell {
            border-bottom: 1px solid transparent;
            border-top: 1px solid transparent;
            cursor: pointer;
          }

          .mat-row:hover .mat-cell {
            border-color: currentColor;
            background-color: #ef4444;

          }

          .demo-row-is-clicked {
            font-weight: bold;
          }
    `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
    titulo = 'Relación de contribuyentes';
    isLoadingBusqueda = false;
    tipoPersonaJuridica = 2;
    isSubmited = false;
    totalRows = 0;
    pageSize = 5;
    currentPage = 0;
    pageSizeOptions: number[] = [3, 5, 10, 25, 100];
    displayedColumns: string[] = [
        'contribuyenteNumero',
        'fechaDJ',
        'desEstadoDj',
        'apellidoPaterno',
        'descDocIdentidad',
        'numDocIdentidad',
        'area',
        'usuarioCreacion',
        'fechaInscripcion',
        'terminalCreacion',
        'acciones'];
    dataSource: MatTableDataSource<ContribuyenteReporte> = new MatTableDataSource();

    classHistorico: Contribuyente[]  = [];

    activities$: Observable<Activity[]>;

    @ViewChild('supportNgForm') supportNgForm: NgForm;
    public formBusquedaContribuyente!: FormGroup;
    public formControl: FormControl;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private service: ContribuyenteService, private formBuilder: FormBuilder, public datepipe: DatePipe, public _activityService: ActivitiesService) { }

    ngOnInit() {

        this.activities$ = this._activityService.activities;

        this.formBusquedaContribuyente = this.formBuilder.group({
            municipalidadId: ['1'],
            docIdentidadId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            numDocIdentidad: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            contribuyenteNumero: new FormControl('', [Validators.required, Validators.maxLength(10)]),
            apellidoPaterno: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            apellidoMaterno: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            nombres: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            razonSocial: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            tipoFiltro: new FormControl('', [Validators.required]),
        });

        this.removeValidators();
        this.buscarContribuyentes();
        this.dataSource.paginator = this.paginator;
    }

    public submit() {
        this.isSubmited = true;
        if (this.formBusquedaContribuyente.valid) {
            this.currentPage = 0;
            this.buscarContribuyentes();
            this.isSubmited = false;
        }
    };

    onReset(): void {
        this.isSubmited = false;
        this.removeValidators();
        this.formBusquedaContribuyente.get('tipoFiltro').setValue("");
        this.supportNgForm.reset();
    }

    get f(): { [key: string]: AbstractControl } {
        return this.formBusquedaContribuyente.controls;
    }

    public myError = (controlName: string, errorName: string) => {
        return this.formBusquedaContribuyente.controls[controlName].hasError(errorName);
    }

    public removeValidators = () => {
        /*
        this.formBusquedaContribuyente.get('docIdentidadId').removeValidators(Validators.required);
        this.formBusquedaContribuyente.get('numDocIdentidad').removeValidators(Validators.required);
        this.formBusquedaContribuyente.get('contribuyenteNumero').removeValidators(Validators.required);
        this.formBusquedaContribuyente.get('apellidoPaterno').removeValidators(Validators.required);
        this.formBusquedaContribuyente.get('apellidoMaterno').removeValidators(Validators.required);
        this.formBusquedaContribuyente.get('nombres').removeValidators(Validators.required);
        this.formBusquedaContribuyente.get('razonSocial').removeValidators(Validators.required);
    */
        this.formBusquedaContribuyente.get('docIdentidadId').disable();
        this.formBusquedaContribuyente.get('numDocIdentidad').disable();
        this.formBusquedaContribuyente.get('contribuyenteNumero').disable();
        this.formBusquedaContribuyente.get('apellidoPaterno').disable();
        this.formBusquedaContribuyente.get('apellidoMaterno').disable();
        this.formBusquedaContribuyente.get('nombres').disable();
        this.formBusquedaContribuyente.get('razonSocial').disable();
    }

    public changeFiltro(e) {
        this.removeValidators();
        this.limpiar();
        this.formBusquedaContribuyente.get('tipoFiltro').setValue(e.value);
        this.isSubmited = false;
        switch (e.value) {
            case "2":
                console.log(this.formBusquedaContribuyente.get('contribuyenteNumero'));
                this.formBusquedaContribuyente.get('contribuyenteNumero').enable();
                //this.formBusquedaContribuyente.get('contribuyenteNumero').addValidators(Validators.required);
                break;
            case "3":
                this.formBusquedaContribuyente.get('docIdentidadId').enable();
                this.formBusquedaContribuyente.get('numDocIdentidad').enable();
                //this.formBusquedaContribuyente.get('docIdentidadId').addValidators(Validators.required);
                //this.formBusquedaContribuyente.get('numDocIdentidad').addValidators(Validators.required);
                break;
            case "4":
                this.formBusquedaContribuyente.get('apellidoPaterno').enable();
                this.formBusquedaContribuyente.get('apellidoMaterno').enable();
                this.formBusquedaContribuyente.get('nombres').enable();
                //this.formBusquedaContribuyente.get('apellidoPaterno').addValidators(Validators.required);
                //this.formBusquedaContribuyente.get('apellidoMaterno').addValidators(Validators.required);
                //this.formBusquedaContribuyente.get('nombres').addValidators(Validators.required);
                break;
            case "5":
                this.formBusquedaContribuyente.get('razonSocial').enable();
                //this.formBusquedaContribuyente.get('razonSocial').addValidators(Validators.required);
                break;
            default:
                break;
        }
    }

    pageBusquedaChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.buscarContribuyentes();
    }

    public limpiar() {
        this.formBusquedaContribuyente.get('tipoFiltro').setValue('');
        this.formBusquedaContribuyente.get('contribuyenteNumero').setValue('');
        this.formBusquedaContribuyente.get('docIdentidadId').setValue('');
        this.formBusquedaContribuyente.get('numDocIdentidad').setValue('');
        this.formBusquedaContribuyente.get('apellidoPaterno').setValue('');
        this.formBusquedaContribuyente.get('apellidoMaterno').setValue('');
        this.formBusquedaContribuyente.get('nombres').setValue('');
        this.formBusquedaContribuyente.get('razonSocial').setValue('');
    }

    public buscarContribuyentes() {
        this.isLoadingBusqueda = true;
        this.service.listarPaginas(this.formBusquedaContribuyente.value, this.pageSize.toString(), (this.currentPage + 1).toString()).subscribe(p => {

            this.dataSource.data = p.data as ContribuyenteReporte[];
            setTimeout(() => {
                this.paginator.pageIndex = this.currentPage;
                this.paginator.length = p.totalRows;
            });
            this.isLoadingBusqueda = false;
        });
    }

    public descargarReporteExcel() {
        var formValue = this.formBusquedaContribuyente.value;
        var data = formValue == "" || formValue == null ? { municipalidadId: "1" } : (formValue.tipoFiltro == "" ? { municipalidadId: "1" } : this.formBusquedaContribuyente.value);
        this.service.getReporteBusquedaExcel(JSON.stringify(data)).subscribe(p => {
            let file = new Blob([p], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        });
    }

    public reporteDJ(contribuyente: ContribuyenteReporte) {
        var data = { municipalidadId: contribuyente.municipalidadId, contribuyenteNumero: contribuyente.contribuyenteNumero };
        var url = this.service.getReporteDjContribuyente(JSON.stringify(data));

        window.open(url, '_blank').focus();
    }

    public eliminar(contribuyente: ContribuyenteReporte): void {

        Swal.fire({
            title: 'Confirmación',
            text: `¿Usted desea eliminar a ${contribuyente.nombres}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.eliminar(1, contribuyente.contribuyenteNumero, contribuyente.numeroDJ).subscribe(() => {
                    this.buscarContribuyentes();
                })
                Swal.fire(
                    'Información',
                    'El registro ha sido eliminado',
                    'success'
                )
            }
        })
    }

    public printResult(): void {
        var divToPrint = document.getElementById("tblContribuyentes").innerHTML;
        var newWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        var gridHtml = '';
        var index = 0;
        this.dataSource.data.map(data => {
            index += 1;
            gridHtml += `<tr>
                     <td>${index}</td>
                     <td>${data.contribuyenteNumero}</td>
                     <td>${this.datepipe.transform(data.fechaDJ, 'dd/MM/yyyy')}</td>
                     <td>${data.tipoPersonaId == this.tipoPersonaJuridica ? data.razonSocial : data.nombreCompleto}</td>
                     <td>${data.desDocIdentidad}</td>
                     <td>${data.numDocIdentidad}</td>
                     <td>${data.desTipoMedioDeterminacion}</td>
                     <td>${data.desMedioDeterminacion}</td>
                     <td>${data.desMotivoDj}</td>
                     <td>${data.desTipoPersona}</td>
                     <td>${data.desCondicion}</td>
                     <td>${data.departamento}</td>
                     <td>${data.provincia}</td>
                     <td>${data.distrito}</td>
                     <td>${data.desDomicilio}</td>
                     <td>${data.desEstadoDj}</td>
                     <td>${data.area}</td>
                     <td>${data.usuarioCreacion}</td>
                     <td>${this.datepipe.transform(data.fechaCreacion, 'dd/MM/yyyy')}</td>
                     <td>${data.terminalCreacion}</td>
                     <td>${data.usuarioModificacion}</td>
                     <td>${this.datepipe.transform(data.fechaModificacion, 'dd/MM/yyyy')}</td>
                     <td>${data.terminalModificacion}</td>
                   </tr>`;
        });
        newWin.document.open();
        newWin.document.write(`<html>
        <head>
          <title>Imprimir</title>
           <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
           <style type="text/css" media="print">
              @page { size: landscape; }
            </style>
        </head>
    <body onload="window.print();window.close()">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Nro Correlativo</th>
          <th>Código</th>
          <th>Fecha de Declaración (Modificación/Registro)</th>
          <th>Nombres/Razón Social</th>
          <th>Documento de Identidad</th>
          <th>Nro documento de Identidad</th>
          <th>Tipo de medio</th>
          <th>Medio</th>
          <th>Motivo</th>
          <th>Tipo de contribuyente</th>
          <th>Condición del contribuyente</th>
          <th>Departamento</th>
          <th>Provincia</th>
          <th>Distrito</th>
          <th>Dirección Fiscal</th>
          <th>Estado</th>
          <th>Área usuaria</th>
          <th>Usuario de creación</th>
          <th>Fecha de creación</th>
          <th>Terminal de creación</th>
          <th>Usuario de modificación</th>
          <th>Fecha de modificación</th>
          <th>Terminal de modificación</th>
        </tr>
      </thead>
      <tbody>
       ${gridHtml}
      </tbody>
    </table>
    </body>
      </html>`)
        newWin.document.close();
    }



    getHistorico(item: Contribuyente) {
        this.service.obtenerHistorico(1, item.contribuyenteNumero)
        .subscribe({
            next: (res: any) => {
                console.log('Obtener historico', res);
                // matriz = res;

                this.classHistorico = res;
                console.log(this.classHistorico);

            },
            error: (error) => {
                console.error('Error: ' + error);
            },
            complete: () => {
                console.log('completo la recuperación de Provincia');
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns whether the given dates are different days
     *
     * @param current
     * @param compare
     */
    isSameDay(current: string, compare: string): boolean {
        return moment(current, moment.ISO_8601).isSame(moment(compare, moment.ISO_8601), 'day');
    }

    /**
     * Get the relative format of the given date
     *
     * @param date
     */
    getRelativeFormat(date: string): string {
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'day').startOf('day');

        // Is today?
        if (moment(date, moment.ISO_8601).isSame(today, 'day')) {
            return 'Today';
        }

        // Is yesterday?
        if (moment(date, moment.ISO_8601).isSame(yesterday, 'day')) {
            return 'Yesterday';
        }

        return moment(date, moment.ISO_8601).fromNow();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { Contribuyente } from 'app/models/contribuyente.models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
    `
  ]
})
export class ListComponent implements OnInit {
  titulo = 'Relación de contribuyentes';
  contribuyentes: Contribuyente[] = [];
  contribuyentesAny: any[] = [] ;
  contribuyente: Contribuyente;
  isLoadingBusqueda = false;
  isSubmited = false;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  displayedColumns: string[] = ['contribuyenteNumero', 'fechaDJ', 'desEstadoDj', 'apellidoPaterno', 'descDocIdentidad', 'numDocIdentidad', 'acciones' ];
  dataSource: MatTableDataSource<Contribuyente> = new MatTableDataSource();

  public formBusquedaContribuyente!: FormGroup;
  public formControl: FormControl;  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ContribuyenteService, private formBuilder: FormBuilder, public datepipe: DatePipe) { }

  ngOnInit() {

    this.formBusquedaContribuyente = this.formBuilder.group({
        municipalidadId: ['1'],
        docIdentidadId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        numDocIdentidad: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        contribuyenteNumero: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        apellidoPaterno:new FormControl('', [Validators.required, Validators.maxLength(50)]),
        apellidoMaterno:new FormControl('', [Validators.required, Validators.maxLength(50)]),
        nombres: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        razonSocial:new FormControl('', [Validators.required, Validators.maxLength(50)]),
        tipoFiltro:new FormControl('', [Validators.required]),
    });

    this.removeValidators();
    this.buscarContribuyentes();

    this.dataSource.paginator = this.paginator;
  }

  public submit(){    
    this.isSubmited = true;
    if(this.formBusquedaContribuyente.valid){
      this.currentPage = 0;
      this.buscarContribuyentes();
      this.isSubmited = false;
    }
  };

  onReset(): void {
    this.isSubmited = false;
    this.formBusquedaContribuyente.reset();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formBusquedaContribuyente.controls;
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.formBusquedaContribuyente.controls[controlName].hasError(errorName);
  }

  public removeValidators = () =>{
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

  public changeFiltro (e){
    this.removeValidators();    
    this.limpiar();
    this.formBusquedaContribuyente.get('tipoFiltro').setValue(e.value);

    switch(e.value){
      case "1":
        console.log(this.formBusquedaContribuyente.get('contribuyenteNumero'));
        this.formBusquedaContribuyente.get('contribuyenteNumero').enable();
        //this.formBusquedaContribuyente.get('contribuyenteNumero').addValidators(Validators.required);
        break;
      case "2":
        this.formBusquedaContribuyente.get('docIdentidadId').enable();
        this.formBusquedaContribuyente.get('numDocIdentidad').enable();
        //this.formBusquedaContribuyente.get('docIdentidadId').addValidators(Validators.required);
        //this.formBusquedaContribuyente.get('numDocIdentidad').addValidators(Validators.required);
        break;
      case "3":
        this.formBusquedaContribuyente.get('apellidoPaterno').enable();
        this.formBusquedaContribuyente.get('apellidoMaterno').enable();
        this.formBusquedaContribuyente.get('nombres').enable();
        //this.formBusquedaContribuyente.get('apellidoPaterno').addValidators(Validators.required);
        //this.formBusquedaContribuyente.get('apellidoMaterno').addValidators(Validators.required);
        //this.formBusquedaContribuyente.get('nombres').addValidators(Validators.required);
        break;
      case "4":
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

  public limpiar(){
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
      this.service.listarPaginas(this.formBusquedaContribuyente.value, this.pageSize.toString(), (this.currentPage +1).toString()).subscribe(p => {

        this.dataSource.data = p.data as Contribuyente[];
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = p.totalRows;
        });
        this.isLoadingBusqueda = false;
      });
  }

  public descargarReporteExcel() {
    var formValue = this.formBusquedaContribuyente.value;
    var data = formValue == "" || formValue == null ? {municipalidadId:"1"}:(formValue.tipoFiltro =="" ? {municipalidadId:"1"}:this.formBusquedaContribuyente.value);
    console.log(this.formBusquedaContribuyente);
    console.log(data);
      this.service.getReporteBusquedaExcel(JSON.stringify(data)).subscribe(p => {
        let file = new Blob([p], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

  public eliminar(contribuyente: Contribuyente): void {

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
        this.service.eliminar(1,contribuyente.contribuyenteNumero).subscribe(() => {
          this.contribuyentes = this.contribuyentes.filter(a => a !== contribuyente)
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

  public filtrar(nombres: string): void {
    this.contribuyente = new Contribuyente();
    this.contribuyente.nombres = nombres
    this.service.filtrarPorNombre(this.contribuyente).subscribe(n => this.contribuyentes = n);
  }

  public printResult(): void {  
    var divToPrint = document.getElementById("tblContribuyentes").innerHTML;  
    var newWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');  
    var gridHtml = '';

    this.dataSource.data.map(data =>{
      gridHtml += `<tr>
                     <td>${data.contribuyenteNumero}</td>
                     <td>${this.datepipe.transform(data.fechaDJ, 'dd/MM/yyyy')}</td> 
                     <td>${data.desEstadoDj}</td>
                     <td>${data.apellidoPaterno + ' ' + data.apellidoMaterno + ' ' +
                     data.nombres}</td>
                     <td>${data.descDocIdentidad}</td>
                     <td>${data.numDocIdentidad}</td>
                   </tr>`;
    });
    newWin.document.open();
    newWin.document.write(`<html>
        <head>
          <title>Imprimir</title>
           <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        </head>
    <body onload="window.print();window.close()">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Código</th>
          <th>Fecha de Registro</th>
          <th>Estado</th>
          <th>Apellidos y Nombres</th>
          <th>Tipo Documento</th>
          <th>N° Documento</th>
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

}

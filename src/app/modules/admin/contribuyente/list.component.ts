import { Component, OnInit, ViewChild } from '@angular/core';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { Contribuyente } from 'app/models/contribuyente.models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  displayedColumns: string[] = ['contribuyenteNumero', 'fechaDJ', 'desEstadoDj', 'apellidoPaterno', 'descDocIdentidad', 'numDocIdentidad', 'acciones' ];
  dataSource: MatTableDataSource<Contribuyente> = new MatTableDataSource();

  public formBusquedaContribuyente!: FormGroup;
  public formControl: FormControl;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ContribuyenteService, private formBuilder: FormBuilder) { }

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
        tipoFiltro:new FormControl('')
    });

    this.removeValidators();
    this.buscarContribuyentes();

    this.dataSource.paginator = this.paginator;
  }

  public submit(){
    console.log(this.formBusquedaContribuyente);
    if(this.formBusquedaContribuyente.valid){
      this.currentPage = 0;
      this.buscarContribuyentes();
    }
  };

  public myError = (controlName: string, errorName: string) =>{
    return this.formBusquedaContribuyente.controls[controlName].hasError(errorName);
  }

  public removeValidators = () =>{
    this.formBusquedaContribuyente.get('docIdentidadId').removeValidators(Validators.required);
    this.formBusquedaContribuyente.get('numDocIdentidad').removeValidators(Validators.required);
    this.formBusquedaContribuyente.get('contribuyenteNumero').removeValidators(Validators.required);
    this.formBusquedaContribuyente.get('apellidoPaterno').removeValidators(Validators.required);
    this.formBusquedaContribuyente.get('apellidoMaterno').removeValidators(Validators.required);
    this.formBusquedaContribuyente.get('nombres').removeValidators(Validators.required);
    this.formBusquedaContribuyente.get('razonSocial').removeValidators(Validators.required);

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
    this.formBusquedaContribuyente.get('tipoFiltro').setValue(e.value);
    switch(e.value){
      case "1":
        console.log(this.formBusquedaContribuyente.get('contribuyenteNumero'));
        this.formBusquedaContribuyente.get('contribuyenteNumero').enable();
        this.formBusquedaContribuyente.get('contribuyenteNumero').addValidators(Validators.required);
        break;
      case "2":
        this.formBusquedaContribuyente.get('docIdentidadId').enable();
        this.formBusquedaContribuyente.get('numDocIdentidad').enable();
        this.formBusquedaContribuyente.get('docIdentidadId').addValidators(Validators.required);
        this.formBusquedaContribuyente.get('numDocIdentidad').addValidators(Validators.required);
        break;
      case "3":
        this.formBusquedaContribuyente.get('apellidoPaterno').enable();
        this.formBusquedaContribuyente.get('apellidoMaterno').enable();
        this.formBusquedaContribuyente.get('nombres').enable();
        this.formBusquedaContribuyente.get('apellidoPaterno').addValidators(Validators.required);
        this.formBusquedaContribuyente.get('apellidoMaterno').addValidators(Validators.required);
        this.formBusquedaContribuyente.get('nombres').addValidators(Validators.required);
        break;
      case "4":
        this.formBusquedaContribuyente.get('razonSocial').enable();
        this.formBusquedaContribuyente.get('razonSocial').addValidators(Validators.required);
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
      this.service.getReporteBusquedaExcel(JSON.stringify(this.formBusquedaContribuyente.value)).subscribe(p => {
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
    //newWin.document.write(divToPrint.outerHTML);
    newWin.document.open();
    newWin.document.write(`<html>
        <head>
          <title>Imprimir</title>
           <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        </head>
    <body onload="window.print();window.close()">${divToPrint}</body>
      </html>`)
    newWin.document.close();
  }

}

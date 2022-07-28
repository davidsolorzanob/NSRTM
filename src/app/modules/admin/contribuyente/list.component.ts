import { Component, OnInit, ViewChild } from '@angular/core';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { Contribuyente } from 'app/models/contribuyente.models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

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
  totalRegistros = 0;
  paginaActual = 1;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor(private service: ContribuyenteService) { }

  ngOnInit() {
    //  this.service.todos().subscribe(contribuyentes=>{
    //    this.contribuyentes = contribuyentes;
    //    console.log(contribuyentes);
    //  });
    this.calcularRangos();


   this.service.listarPaginas(this.totalPorPagina.toString(),this.paginaActual.toString()).subscribe(p => {

    this.contribuyentes = p.data as Contribuyente[];

  });

  }

  paginar(event: PageEvent): void {

    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }


  public calcularRangos() {

    this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(p => {
      //  this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(p => {
      //this.contribuyentes = p.content as Contribuyente[];
      //this.totalRegistros = p.totalElements as number;
     // this.paginator._intl.itemsPerPageLabel = 'Registro por página';

      this.contribuyentes = p.data as Contribuyente[];
      console.log(p);
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
}

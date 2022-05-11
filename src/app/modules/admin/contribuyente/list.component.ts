import {  Component, OnInit} from '@angular/core';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { Contribuyente } from 'app/models/contribuyente.models';
import { NumericDictionaryIteratee } from 'lodash';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  templateUrl: 'list.component.html',
  styles         : [
    /* language=SCSS */
    `
        .inventory-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: 48px auto 112px 72px;
            }

            @screen md {
                grid-template-columns: 48px 112px auto 112px 72px;
            }

            @screen lg {
                grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
            }
        }
    `
  ]})
export class ListComponent implements OnInit {
  titulo = 'Relación de contribuyentes';
  contribuyentes: Contribuyente[];

  totalRegistros: number=0;
  paginaActual:number =0;
  totalPorPagina:number = 4;
  pageSizeOptions: number[] = [3,5,10,25,100];

  constructor(private service: ContribuyenteService) { }

  ngOnInit() {
    this.service.todos().subscribe(contribuyentes=>{
      this.contribuyentes = contribuyentes;
    });     
     this.calcularRangos();
  

  }

    paginar(event: PageEvent ): void{

      this.paginaActual = event.pageIndex;
      this.totalPorPagina = event.pageSize;
      this.calcularRangos();
    }


    private calcularRangos(){

      const paginaActual = this.paginaActual+'';
      const totalRegistro = this.totalRegistros+'';
   
      this.service.listarPaginas(paginaActual,totalRegistro).subscribe(p =>{
       
       this.contribuyentes = p.content as Contribuyente[];
       this.totalRegistros = p.totalElements as number;
   
      } );
    }


}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contribuyente } from 'app/models/contribuyente.models';
import { ContribuyenteService } from 'app/services/contribuyente.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-contribuyente',
  templateUrl: './contribuyente.component.html',
  styleUrls: ['./contribuyente.component.css']
})
export class ContribuyenteComponent implements OnInit {

  contribuyente: Contribuyente = new Contribuyente();

  error: any;

  contribuyentes: Contribuyente[];


  panelContribuyenteOpenState= false;
  panelDomicilioFiscal=false;
  panelRelacionado=false;
  panelCondicion=false;
  panelContacto=false;
  panelInformacionAdicional=false;
  panelSustento;
  panelOpenState = false;

  
  constructor(private service: ContribuyenteService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      console.log(id + 'nuevo request');
      if(id){
        this.service.ver(id).subscribe(contribuyente => this.contribuyente = contribuyente)
      }
    })
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




}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Route } from '@angular/router';
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

  constructor(private service: ContribuyenteService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('contribuyenteId');
      if(id){
        this.service.ver(id).subscribe(contribuyente => this.contribuyente = contribuyente)
      }
    })
  }
  public crear(): void {
    this.service.crear(this.contribuyente).subscribe({
      next: (contribuyente) => {
        console.log(contribuyente);
        alert('Contribuyente creado con exito ${contribuyente.nombres}');
        //Swal.fire('Nuevo:', `Contribuyente ${contribuyente.nombres} creado con éxito`, 'success');
        this.router.navigate(['/list']);
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
        alert('Contribuyente fue editafo con exito ${this.contribuyente.nombres}');
        //Swal.fire('Nuevo:', `Contribuyente ${contribuyente.nombres} creado con éxito`, 'success');
        this.router.navigate(['/list']);
      }
      , error: (err) => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error);
        }
      }
    });
  }




}

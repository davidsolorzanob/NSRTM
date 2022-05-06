import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-contribuyente',
  templateUrl: './contribuyente.component.html',
  styleUrls: ['./contribuyente.component.css'],
  encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContribuyenteComponent
  {
   
    constructor(){}


    ngOnInit(): void{

    }
    
}

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContribuyenteService } from 'app/services/contribuyente.service';
import { Contribuyente } from 'app/models/contribuyente.models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  titulo = 'Relación de contribuyentes';
  contribuyentes: Contribuyente[];
  constructor(private service: ContribuyenteService) { }

  ngOnInit() {
    this.service.todos().subscribe(contribuyentes=>{
      this.contribuyentes = contribuyentes;
    });     
  }

}

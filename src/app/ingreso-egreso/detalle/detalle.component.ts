import { IngresoEgresoService } from './../ingreso-egreso.service';
import { Subscription } from 'rxjs';
import { AppState } from './../../ui.app.reducer';
import { IngresoEgreso } from './../ingreso-egreso.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    public ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {

    this.subscription = this.store.select('ingresoEgreso')
    .subscribe( ingresoEgreso => {
      this.items = ingresoEgreso.items;
    });
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  borrarItem (item: IngresoEgreso): void {
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
    .then( () => {
      this.swAlert('Eliminado',item.descripcion,'success' );
    })
  }

    // alerta para msj
    swAlert(title: string, text:string, icon:any){
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
      });
    }

}

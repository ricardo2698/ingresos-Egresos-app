import { ActivarLoadingAction, DesactivarLoadingAction } from './../shared/ui.actions';
import { Subscription } from 'rxjs';
import { AppState } from './../ui.app.reducer';
import { IngresoEgresoService } from './ingreso-egreso.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.scss']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  form: FormGroup;
  tipo: string = 'ingreso';

  loadingSubs: Subscription = new Subscription();
  cargando: boolean;

  constructor(
    private fb: FormBuilder,
    public ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.loadingSubs = this.store.select('ui').subscribe(
      ui => {
        this.cargando = ui.isLoading;
      }
    )

    this.formBuil();
  }

  ngOnDestroy(){
    this.loadingSubs.unsubscribe();
  }

  formBuil(){
    this.form = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: [0, [Validators.required, Validators.min(0)]],
    });
  }

  crearIngresoEgreso(e: Event){

    this.store.dispatch(new ActivarLoadingAction());

    const ingresoEgreso = new IngresoEgreso({ ...this.form.value, tipo: this.tipo });
    console.log(ingresoEgreso);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
    .then( () => {
      this.store.dispatch(new DesactivarLoadingAction());
      this.swAlert('Creado',ingresoEgreso.descripcion, 'success');
    })
    .catch( err => {
      this.store.dispatch(new DesactivarLoadingAction());
    })

    this.form.reset({ monto: 0});
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

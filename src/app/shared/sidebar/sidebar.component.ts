import { IngresoEgresoService } from './../../ingreso-egreso/ingreso-egreso.service';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from './../../ui.app.reducer';
import { Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string;
  email: string;
  subscription: Subscription = new Subscription;

  constructor(
    public authService: AuthService,
    public ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.subscription = this.store.select('auth')
    .pipe(
      filter( auth => auth.user != null
      )
    )
    .subscribe(
      auth => {

        this.nombre = auth.user.nombre;
        this.email = auth.user.email;

      }
    );
  };

  logaout(){
    this.authService.logout();
    this.ingresoEgresoService.cancelarSubscriptions();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

import { Subscription } from 'rxjs';
import { DataObj, User } from './../../auth/user.model';
import { AppState } from './../../ui.app.reducer';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<AppState>
  ) { }

  nombre: string;
  subscription: Subscription = new Subscription;

  ngOnInit(): void {

    this.subscription = this.store.select('auth')
    .pipe(
      filter( auth => auth.user != null
      )
    )
    .subscribe(
      auth => {

        this.nombre = auth.user.nombre;

      }
    );
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}

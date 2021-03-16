import { AppState } from './../../ui.app.reducer';
import { AuthService } from './../auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando: boolean;
  subscription: Subscription;


  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.subscription = this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading);

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  login( data: any ){
    this.authService.login(data.email, data.password);
  }

}

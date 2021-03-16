import { Subscription } from 'rxjs';
import { AppState } from './../../ui.app.reducer';
import { AuthService } from './../auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy{

  cargando: boolean;
  subscription: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSubmit( data: any ){
    /* console.log(data); */
    this.authService.crearUsuario(data.nombre, data.email, data.password);
  }

}

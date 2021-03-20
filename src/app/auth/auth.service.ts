import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// redux
import { Store } from '@ngrx/store';
import { AppState } from './../ui.app.reducer';
import * as fromAction from './../shared/ui.actions';
import { SetUserAction, UnSetUserAction } from './auth.actions';



// rxjs
import { map } from 'rxjs/operators'

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

// Firebase
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

import { DataObj, User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private  userSuscription: Subscription = new Subscription();

  private user: User;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthListainer(){
    this.afAuth.authState.subscribe( fbUser => {
      if( fbUser ){
        this.userSuscription = this.afDB.doc(`${ fbUser.uid }/usuario`).valueChanges()
        .subscribe( (usuarioObj: any) => {
          console.log(usuarioObj);
          const newUser = new User(usuarioObj);
          this.user = usuarioObj;
          this.store.dispatch( new SetUserAction(newUser));
        } )
      }else{
        this.user = null;
        this.userSuscription.unsubscribe();
      }
    });
  }

  crearUsuario( nombre, email, password){

    this.store.dispatch( new fromAction.ActivarLoadingAction() );

    this.afAuth.createUserWithEmailAndPassword(email, password)
    .then( res => {
      /* console.log(res); */
      const user:User = {
        uid: res.user.uid,
        nombre: nombre,
        email: res.user.email
      };

      this.afDB.doc(`${ user.uid }/usuario`)
          .set( user )
          .then( () => {
            this.router.navigate(['/']);
            this.store.dispatch( new fromAction.DesactivarLoadingAction() );

          });

    })
    .catch( error => {
      console.log(error.message);
      this.store.dispatch( new fromAction.DesactivarLoadingAction());
      this.swAlert('Error!',error.message);
    })
  }

  login(email: string, password: string ){

    this.store.dispatch( new fromAction.ActivarLoadingAction() );

    this.afAuth.signInWithEmailAndPassword(email, password)
    .then(
      res=> {
        console.log(res);
        this.router.navigate(['/']);
        this.store.dispatch( new fromAction.DesactivarLoadingAction() );
      }
    )
    .catch(
      error => {
        console.log(error);
        this.store.dispatch( new fromAction.DesactivarLoadingAction() );
        this.swAlert('Error!',error.message);
      }
    )
  }

  logout(){
    this.router.navigate(['/login']);
    this.afAuth.signOut();
    this.store.dispatch( new UnSetUserAction);
  }

  // alerta para msj de errorr
  swAlert(title: string, text:string){
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  isAuth(){
    return this.afAuth.authState.pipe(
      map(
        fbUser => {
          if( fbUser === null){
            this.router.navigate(['/login']);
          }
          return fbUser != null;
        }
      )
    );
  }

  getUser(){
    return {... this.user};
  }

}

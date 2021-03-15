import { User } from './user.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { map } from 'rxjs/operators'

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

// Firebase
import * as firebase from 'firebase';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore
  ) { }

  initListainer(){
    this.afAuth.authState.subscribe( fbUser => {
      console.log(fbUser);
    });
  }

  crearUsuario( nombre, email, password){
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
          });

    })
    .catch( error => {
      console.log(error.message);
      this.swAlert('Error!',error.message);
    })
  }

  login(email: string, password: string ){
    this.afAuth.signInWithEmailAndPassword(email, password)
    .then(
      res=> {
        console.log(res);
        this.router.navigate(['/']);
      }
    )
    .catch(
      error => {
        console.log(error);
        this.swAlert('Error!',error.message);
      }
    )
  }

  logout(){
    this.router.navigate(['/login']);
    this.afAuth.signOut();
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

}

import { UnSetUserAction } from './../auth/auth.actions';
import { SetItemsAction, UnSetItemsAction } from './ingreso-egreso.actions';
import { AppState } from './../ui.app.reducer';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  prueba: number;

  ingresooEgreso: IngresoEgreso;

  ingresoEgresoListainerSubcripcion: Subscription = new Subscription;
  ingresoEgresoItemSubcripcion: Subscription = new Subscription;

  constructor(
    private afDB: AngularFirestore,
    public authService: AuthService,
    private store: Store<AppState>
  ) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ){
    const user = this.authService.getUser();
    return this.afDB.doc(`${ user.uid }/ingresos-egresos`)
    .collection('items').add({...ingresoEgreso});
  }

  borrarIngresoEgreso( uid:string ){
    const user = this.authService.getUser();
    return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`)
                    .delete();



  }

  initIngresoEgresoListener(){
    this.ingresoEgresoListainerSubcripcion = this.store.select('auth')
    .pipe(                              // pipe para transformar la info, ya que en un momento del subcribe este seria null
      filter( auth => auth.user != null)
    )
    .subscribe( auth => {
      this.ingresoEgresoItems(auth.user.uid);
    })
  };

  private ingresoEgresoItems( uid:string ){

    this.ingresoEgresoItemSubcripcion = this.afDB.collection(`${uid}/ingresos-egresos/items`)
    .snapshotChanges()
    .pipe(
      map( docData => {
        return docData.map( (doc:any) => {
          return {
            uid: doc.payload.doc.id,
            monto: doc.payload.doc.data().monto,
            tipo: doc.payload.doc.data().tipo,
            descripcion: doc.payload.doc.data().descripcion,

          };
        });
        } )
    )
    .subscribe( (collecion: any[]) => {
      this.store.dispatch( new SetItemsAction(collecion));
      console.log('collecion');

      console.log(collecion);
    });

  };



  cancelarSubscriptions(){
    this.ingresoEgresoListainerSubcripcion.unsubscribe();
    this.ingresoEgresoItemSubcripcion.unsubscribe();
    this.store.dispatch( new UnSetItemsAction() );
  }




}

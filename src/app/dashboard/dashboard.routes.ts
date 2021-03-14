import { DetalleComponent } from './../ingreso-egreso/detalle/detalle.component';
import { IngresoEgresoComponent } from './../ingreso-egreso/ingreso-egreso.component';
import { EstadisticaComponent } from './../ingreso-egreso/estadistica/estadistica.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';



export const dashboardRoutes: Routes = [
  { path: '', component: EstadisticaComponent },
  { path: 'ingreso-egreso', component: IngresoEgresoComponent },
  { path: 'detalle', component: DetalleComponent },
];


import { Subscription } from 'rxjs';
import { AppState } from './../../ui.app.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Label } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.scss']
})
export class EstadisticaComponent implements OnInit {

  ingresos: number;
  egresos: number;

  cuantosIngresos: number;
  cuantosEgresos: number;

  Subscription: Subscription = new Subscription;

  public pieChartLabels: Label[] = ['Ingreso', 'Egreso'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.Subscription = this.store.select('ingresoEgreso')
    .subscribe( ingresoEgreso => {
      this.contarIngresoEgreso(ingresoEgreso.items);
    } )
  }

  contarIngresoEgreso( items: IngresoEgreso[] ){
    this.ingresos = 0;
    this.egresos = 0;

    this.cuantosIngresos = 0;
    this.cuantosEgresos = 0;

    items.forEach( item => {
      if( item.tipo === 'ingreso' ){
        this.cuantosIngresos ++;
        this.ingresos += item.monto;
      }else{
        this.cuantosEgresos ++;
        this.egresos += item.monto;
      }
    });

    this.pieChartData = [this.ingresos, this.egresos];
  }

}

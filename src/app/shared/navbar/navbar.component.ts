import { DataObj, User } from './../../auth/user.model';
import { AppState } from './../../ui.app.reducer';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private store: Store<AppState>
  ) { }

  user: DataObj;

  ngOnInit(): void {
    this.store.select('auth')
    .subscribe(
      user => {

        console.log('desde navBar');
        console.log(user);
      }
    )
  }



}

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor( private router: Router,
    public authService: AuthService) { }

  canActivate(){
    return this.authService.isAuth();
  }
}

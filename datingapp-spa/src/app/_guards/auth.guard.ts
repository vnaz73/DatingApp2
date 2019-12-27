import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private alertify: AlertifyService,
              private authService: AuthService) {}

  canActivate(): boolean  {
    if (this.authService.loggedIn()) {
      return true;
    }
    this.alertify.error('You shall not pasa!!!');
    this.router.navigate(['/home']);
    return false;

  }

}

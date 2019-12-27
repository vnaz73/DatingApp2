import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private auth: AuthService,
              private alertify: AlertifyService,
              private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.model).subscribe(next => {
      this.alertify.success('Logging successfully');
    },
    error => {
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/members']);
    });

  }

  loggedIn() {
    return this.auth.loggedIn();

  }

  logOut() {
    localStorage.removeItem('token');
    this.alertify.message('log out');
    this.router.navigate(['/home']);
  }
}

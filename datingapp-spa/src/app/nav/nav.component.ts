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
  photoUrl: string;

  constructor(private auth: AuthService,
              private alertify: AlertifyService,
              private router: Router) { }

  ngOnInit() {
    this.auth.currentPhotoUrl.subscribe(photoUrl => {
      this.photoUrl = photoUrl;
    });
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
    localStorage.removeItem('user');
    this.auth.currentUser = null;
    this.auth.decodedToken = null;
    this.alertify.message('log out');
    this.router.navigate(['/home']);
  }
}

import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', {static: false}) editForm: NgForm;
  user: User;
  photoUrl: string;
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //  if (this.editForm.dirty) {
   //   $event.returnValue = true; }
  // }
  @HostListener('window:beforeunload')
  onBeforeUnload() {
    return false;
}
  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
              private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => {
      this.photoUrl = photoUrl;
    });
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Updating User');
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });

  }
  updateMainPhoto(url: string) {
    this.user.photoUrl = url;
  }
}

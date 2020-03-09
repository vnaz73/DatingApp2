
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../_services/alertify.service';
import { Message } from '../models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()

export class MessagesResolver implements Resolve < Message[] > {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private userService: UserService,
                private router: Router,
                private authService: AuthService,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Message[] | Observable< Message[]> | Promise< Message[]> {
        return this.userService.getMessages(this.authService.decodedToken.nameid,
            this.pageNumber, this.pageSize, this.messageContainer).pipe(
            catchError(error => {
                this.alertify.error('Error retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }

}

import { User } from '../models/user';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()

export class MemberListResolver implements Resolve < User[] > {

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User[] | Observable< User[]> | Promise< User[]> {
        return this.userService.getUsers().pipe(
            catchError(error => {
                this.alertify.error('Error retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }

}

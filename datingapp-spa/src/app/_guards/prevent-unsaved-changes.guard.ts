import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {

  constructor(   private alertify: AlertifyService) {}

  canDeactivate(component: MemberEditComponent): boolean  {
    if (component.editForm.dirty) {
      return confirm('Any unsaved changes will be lost. Continue?');

      } return true;



  }

}

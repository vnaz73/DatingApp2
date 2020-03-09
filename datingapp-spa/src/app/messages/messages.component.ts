import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination, PaginatedResult } from '../models/pagination';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];

  messageContainer = 'Unread';
  pagination: Pagination;

  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private router: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.messages = data.messages.result;
      this.pagination = data.messages.pagination;
  });
  }

  loadMessages() {
    // console.log(this.userParams);
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessages(currentUserId,
          this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
      .pipe(
        tap((res: PaginatedResult<Message[]>) => {
          const messages = res.result;
          for (let i = 0; i < messages.length; i++) {
            if (!messages[i].isRead && currentUserId === messages[i].recipientId) {
              this.userService.markMessageAsRead(currentUserId, messages[i].id);
            }
          }
        })
      )
      .subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });

  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure to delete this message?', () => {
      this.userService.deletedMessage(id, this.authService.decodedToken.nameid)
      .subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id));
        this.alertify.success('The message was deleted');
      }, error => this.alertify.error(error));
    });

  }
  pageChanged(event: any): void {

    this.pagination.currentPage = event.page;
    console.log(this.pagination.currentPage);
    this.loadMessages();
  }
}

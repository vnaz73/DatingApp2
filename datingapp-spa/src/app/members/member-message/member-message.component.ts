import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.css']
})
export class MemberMessageComponent implements OnInit {
@Input() recipientId: number;
messages: Message[];
newMessage: any = {};

  constructor(private authService: AuthService,
              private alertify: AlertifyService, private userService: UserService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .subscribe(messages => {
        this.messages = messages;
      }, error => this.alertify.error(error));
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
    .subscribe((message: Message) => {
      const user: User = JSON.parse(localStorage.getItem('user'));
      message.senderKnownAs = user.knownAs;
      message.senderPhotoUrl = user.photoUrl;
      this.messages.unshift(message);
      this.newMessage.content = '';
    });
  }
}

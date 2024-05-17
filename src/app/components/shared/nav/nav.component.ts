import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '@app/models/message/Message';
import { MessageService } from '@app/services/message/message.service';
import { AccountService } from '@app/services/user/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @ViewChild('navbarToggler') navbarToggler:ElementRef;
  messages: Message[] = []

  constructor(public accountService: AccountService, public messageService: MessageService) { }

  ngOnInit() {
    this.messageService.currentMessages$.subscribe((messages) => {
      this.messages = messages;
    })
  }

  navBarTogglerIsVisible(): boolean{
    return this.navbarToggler.nativeElement.offsetParent !== null;
  }

  closeMenu() {
    if (this.navBarTogglerIsVisible()) {
      this.navbarToggler.nativeElement.click();
    }
  }

  logout(): void {
    this.accountService.logout();
  }

  newMessages(): number{
    return this.messages.filter(m => !m.read).length;
  }

}

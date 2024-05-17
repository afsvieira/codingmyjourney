import { Component } from '@angular/core';
import { AccountService } from './services/user/account.service';
import { User } from './models/user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Coding My Journey - By Antonio Vieira';

  constructor(public accountService: AccountService){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    let user: User;

    if (sessionStorage.getItem('user'))
      user = JSON.parse(sessionStorage.getItem('user') ?? '{}');
    else
      user = null

    if (user)
      this.accountService.setCurrentUser(user);
  }

}

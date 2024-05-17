import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, take } from 'rxjs';
import { User } from '@app/models/user/user';
import { environment } from '@environments/environment';
import { Message } from '@app/models/message/Message';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  baseURL = environment.apiURL + 'api/User/';



  constructor(private http: HttpClient, private messageService: MessageService) { }

  public async login(model: any): Promise<Observable<User>>{
    return this.http.post<User>(`${this.baseURL}Login`, model).pipe(take(1));
  }

  public logout(): void{
    sessionStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  public setCurrentUser(user: User): void {
    this.currentUserSource.next(user);
    this.messageService.loadMessages();
    sessionStorage.setItem('user', JSON.stringify(user));
  }

}

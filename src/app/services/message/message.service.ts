import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@app/models/message/Message';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseURL = environment.apiURL + 'api/Message/';
  private currentMessagesSource = new ReplaySubject<Message[]>(1);
  public currentMessages$ = this.currentMessagesSource.asObservable();

  constructor(private http: HttpClient) { }

  public loadMessages(): void{
    this.getMessages().subscribe((messages) => {
      this.currentMessagesSource.next(messages);
    });
  }

  public createMessage(message: Message): Observable<Message>{
    return this.http.post<Message>(`${this.baseURL}CreateMessage`, message).pipe(take(1));
  }

  public getMessages(): Observable<Message[]>{
    return this.http.get<Message[]>(`${this.baseURL}GetMessages`).pipe(take(1));
  }

  public deleteMessage(messageId): Observable<boolean>{
    return this.http.delete<boolean>(`${this.baseURL}DeleteMessage/${messageId}`).pipe(take(1));
  }

  public updateMessage(model: Message): Observable<Message>{
    return this.http.put<Message>(`${this.baseURL}Update/${model.id}`, model).pipe(take(1));
  }



}

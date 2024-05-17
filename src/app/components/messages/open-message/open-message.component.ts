import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Message } from '@app/models/message/Message';
import { MessageService } from '@app/services/message/message.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-open-message',
  templateUrl: './open-message.component.html',
  styleUrls: ['./open-message.component.scss']
})
export class OpenMessageComponent implements OnInit {
  messageForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<OpenMessageComponent>,
              @Inject(MAT_DIALOG_DATA) public message: any,
              private spinner: NgxSpinnerService,
              private messageService: MessageService,
              private fb: FormBuilder
  ){}
  ngOnInit(): void {
    console.log(this.message);
    this.messageForm = this.fb.group({
      id: [{value: '', disabled: true}],
      name: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      phone: [{value: '', disabled: true}],
      comment: [{value: '', disabled: true}],
      read: [''],
      replied: [''],
      date: [{value: '', disabled: true}]
    });

    this.messageForm.patchValue(this.message.message);

  }

  decline(): void{
    this.dialogRef.close();
  }

  changeRepliedStatus(event: any): void{

    let message = this.message.message as Message;
    message.replied = event.target.checked;
    this.spinner.show();
    this.messageService.updateMessage(message).subscribe({
      next: (message) => {
        this.messageService.loadMessages();
      },
      error: (err) => {
        console.log(err);
        this.messageService.loadMessages();
        this.spinner.hide();
      },
      complete: () => {this.spinner.hide();}
    });
  }
}

import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Message } from '@app/models/message/Message';
import { MessageService } from '@app/services/message/message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OpenMessageComponent } from './open-message/open-message.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  modalRef!: BsModalRef;
  messages: Message[] = [];
  messageId: number;

  constructor(private messageService: MessageService,
              private messageDialog: MatDialog,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService
            ) { }

  ngOnInit() {
    this.messageService.currentMessages$.subscribe((messages) => {
      this.messages = messages;
    })
  }

  openModal(template: TemplateRef<any>, messageId: number, event: any): void {
    event.stopPropagation();
    this.messageId = messageId;
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  getRowClass(row) {
    return {
      'bg-light': !row.read
    };
  }

  getCellClass({ row, column, value }): any {
    return {
      'text-info-emphasis': !row.read
    };
  }


  openMessage(event: any): void{
    if(event.type == 'click'){
      var messageId = event.row.id;
      var message = this.messages.find(m => m.id == messageId);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.hasBackdrop = true;
      dialogConfig.panelClass = ['card', 'border-primary', 'shadow-lg'];
      dialogConfig.width = '550px';
      dialogConfig.data = {message};
      const dialogRef = this.messageDialog.open(OpenMessageComponent, dialogConfig);
      if(!message.read){
        this.changeReadStatus(messageId, null);
      }
    }
  }

  deleteMessage(): void{
    this.modalRef.hide();
    this.spinner.show();
    this.messageService.deleteMessage(this.messageId).subscribe({
      next: (result) => {
        console.log(result);
        this.toastr.success("Message deleted.", "Success");
        this.messageService.loadMessages();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Error deleting message. Try again.", "Error")
        this.spinner.hide();
      },
      complete: () => {this.spinner.hide();}
    })
  }

  decline(): void{
    this.modalRef.hide();
  }

  changeReadStatus(messageId: number, event: any): void{
    if(event)
    event.stopPropagation();
    let message = this.messages.find(m => m.id == messageId);
    message.read = !message.read;
    this.spinner.show();
    this.messageService.updateMessage(message).subscribe({
      next: (message) => {
        this.messageService.loadMessages();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Error updating message", "Error");
        this.messageService.loadMessages();
        this.spinner.hide();
      },
      complete: () => {this.spinner.hide();}
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from '@app/models/message/Message';
import { MessageService } from '@app/services/message/message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  form!: FormGroup;

  get f(): any{
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              private messageService: MessageService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: [0],
      name:['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      comment: ['', Validators.required]
    });
  }

  public cssValidator(field: FormControl | AbstractControl): any {
    if(field === undefined) return;
    return { 'is-invalid': field.errors && field.touched };
  }

  sendMessage(): void{
    this.spinner.show();
    let message: Message = {... this.form.value};
    message.id = 0;
    message.date = new Date();
    this.messageService.createMessage(message).subscribe({
      next: (message) => {
        this.toastr.success("Message sent.", "Success");
        this.form.reset();
        console.log(message);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Error sending message. Please try again later.", "Error");
        this.spinner.hide();
      },
      complete: () => {this.spinner.hide();}
    });
  }

}

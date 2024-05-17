import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user/user';
import { UserLogin } from '@app/models/user/UserLogin';
import { AccountService } from '@app/services/user/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = {} as UserLogin;
  errorMsg = "";
  error = false;

  constructor(private accountService: AccountService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,) { }

  ngOnInit() {
  }

  public async login(): Promise<void> {
    this.spinner.show();
    var user = {} as User;
    let redirectUrl = this.activatedRoute.snapshot.queryParams['redirect'] || '/home';
    await lastValueFrom(await this.accountService.login(this.model)).then(
      (response: User) => {
        user = response;
        this.accountService.setCurrentUser(user);
        redirectUrl = redirectUrl == '/'? '/home' : redirectUrl;
        this.router.navigate([redirectUrl]);
        this.spinner.hide();
      },
      (error : any) => {
        if(error.error == "User does not exist."){
          this.error = true;
          this.errorMsg = "User does not exist."
        }
        else if(error.error == "Password incorrect."){
          this.error = true;
          this.errorMsg = "Password incorrect."
        }
        this.spinner.hide();
      }
    );
  }

}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private toastr: ToastrService){ }

  canActivate(): boolean {
    if(sessionStorage.getItem('user') !== null){
      return true;
    }
    else{

    }

    this.toastr.info("Unauthenticated user", "Information");
    this.router.navigate(['/home']);
    return false;
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication-service';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
      private authService: AuthenticationService,
      private route: Router
        ) {}

    canActivate(): boolean {
      if (this.authService.isLoggedIn) {
        return true;
      } else {
        this.route.navigateByUrl('/login');
        return false;
      }
    }

}

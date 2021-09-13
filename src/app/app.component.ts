import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './shared/authentication-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) {
      if (this.authService.isLoggedIn) {
        console.log('logged!');
      } else {
        this.router.navigateByUrl('login');
      }
    }
}

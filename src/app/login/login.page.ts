import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../shared/authentication-service';
import { PushNotificationsService } from '../shared/push-notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private pushService: PushNotificationsService,
    private toastController: ToastController
    ) { }

  ngOnInit() {

  }

  logIn(email, password) {
    this.authService.signIn(email.value, password.value)
      .then(async (res) => {
        // activar notificaciones push y guardar token si no existe
        await this.pushService.initPush();
        console.log('push init!');

        const toast = await this.toastController.create({
          message: 'Now you are identified.',
          duration: 2000
        });
        toast.present();
        this.router.navigate(['parcela']);
      }).catch(async (error) => {
        const toast = await this.toastController.create({
          message: error.message,
          duration: 4000
        });
        toast.present();
      });
  }

}

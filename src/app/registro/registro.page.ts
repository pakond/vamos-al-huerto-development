import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../shared/authentication-service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  async signUp(email, password){
    this.authService.registerUser(email.value, password.value)
    .then(async (res) => {
      const toast = await this.toastController.create({
        message: 'Gracias por registrarse.',
        duration: 2000
      });
      toast.present();
      this.router.navigateByUrl('/');
    }).catch(async (error) => {
      const toast = await this.toastController.create({
        message: error.message,
        duration: 2000
      });
      toast.present();
    });
  }

}

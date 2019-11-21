import { Component, OnInit } from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  errorMessage = '';
  successMessage = '';

  constructor(private navCtrl: NavController, private authService: AuthenticationService, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  register(form) {
    this.authService.registerUser(form.value).then(res => {
      this.authService.updateProfile(form.value.username).then(ret => {
        this.successMessage = 'Your account has been created. Please log in.';
        this.toastCtrl.create({
          message: this.successMessage,
          duration: 3000
        }).then((toastData) => {
          toastData.present();
        });
        this.navCtrl.navigateForward('/login');
      }, err => {
        this.errorMessage = err.message;
        console.log(this.errorMessage);
      });
    }, err => {
      const toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000
      }).then((toastData) => {
        toastData.present();
      });
    });
  }

}

import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {NavController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  errorMessage = '';

  constructor(private navCtrl: NavController, private authService: AuthenticationService, private toastCtrl: ToastController) { }

  ngOnInit() {
  }
  login(form) {
    this.authService.loginUser(form.value)
        .then(res => {
          console.log(res);
          this.errorMessage = '';
          this.navCtrl.navigateForward('/main');
        }, err => {
          this.errorMessage = err.message;
          const toast = this.toastCtrl.create({
                message: err.message,
                duration: 3000
            }).then((toastData) => {
                toastData.present();
            });
        });
  }
}

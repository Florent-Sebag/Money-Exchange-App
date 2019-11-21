import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IonSelect, NavController, Platform, ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../services/authentication.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})

export class MainPage implements OnInit {
  private myObs: any;
  private rates: any[];
  private syms: any[];
  private baseCurrency = 'EUR';
  private user: any;

  constructor(private httpClient: HttpClient, private navCtrl: NavController, private authService: AuthenticationService,
              private toastCtrl: ToastController, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder,
              private fcm: FCM, public plt: Platform) {

      this.plt.ready()
          .then(() => {
              this.fcm.subscribeToTopic('news').then(data => console.log(data));
              this.fcm.onNotification().subscribe( data => {
                  if (data.wasTapped) {
                      console.log('Received in background');
                  } else {
                      console.log('Received in foreground');
                  }
              });

              this.fcm.onTokenRefresh().subscribe(token => {
              });
          });
  }

  fetchRates(from: string): Observable<any> {
      return this.httpClient.get<any>('https://api.exchangeratesapi.io/latest?base=' + from).pipe(map(res => res || []));
  }

  fetchSymbols(): Observable<any> {
      return this.httpClient.get<any>('http://data.fixer.io/api/symbols?access_key=318f00ec8dd0dc488c14121b6e26279d')
          .pipe(map(res => res || []));
  }

  fetchCountryLocation(lat, lng) {
      return this.httpClient.get<any>('http://api.geonames.org/countryCodeJSON?lat=' + lat + '&lng=' + lng + '&username=foobar')
          .pipe(map(res => res || []));
  }

  showWelcomeMsg() {
      this.geolocation.getCurrentPosition().then((resp) => {
          console.log(resp.coords.latitude);
          console.log(resp.coords.longitude);
          this.myObs = this.fetchCountryLocation(resp.coords.latitude, resp.coords.longitude);
          this.myObs.subscribe(data => {
              const msg = 'Welcome in ' + data['countryName'];
              this.toastCtrl.create({
                  message: msg,
                  duration: 3000
              }).then((toastData) => {
                  toastData.present();
              });
          });
      }).catch((error) => {
          console.log('Error getting location', error);
      });
  }

  updateRates(isInit) {
      this.myObs = this.fetchRates(this.baseCurrency);
      this.myObs.subscribe(data => {
          this.rates = data.rates;
          console.log('RATES');
          console.log(data);
          if (this.baseCurrency === 'EUR') {
              this.rates['EUR'] = '1.0';
          }
          if (isInit) {
              this.showWelcomeMsg();
          }
      });
  }

  ngOnInit() {
      this.user = this.authService.userDetails();
      this.updateRates(true);
      this.myObs = this.fetchSymbols();
      this.myObs.subscribe(data => {
          console.log('SYM');
          this.syms = data.symbols;
          console.log(data);
      });
  }
  onBaseChange($event) {
      this.baseCurrency = $event.target.value;
      this.updateRates(false);
  }
  logout() {
      this.authService.logoutUser()
          .then(res => {
              console.log(res);
              this.navCtrl.navigateBack('/login');
          })
          .catch(error => {
              const toast = this.toastCtrl.create({
                  message: error.message,
                  duration: 3000
              }).then((toastData) => {
                  toastData.present();
              });
          });
  }

}

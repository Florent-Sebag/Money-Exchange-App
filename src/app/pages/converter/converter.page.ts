import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {IonSelect} from '@ionic/angular';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.page.html',
  styleUrls: ['./converter.page.scss'],
})

// tslint:disable-next-line:align label-position

export class ConverterPage implements OnInit {
  baseCurrency = 'EUR';
  toCurrency = 'USD';
  // @ViewChild('base', { read: ElementRef }) baseSelect: ElementRef;
  @ViewChild('baseSelect', {static : false}) baseSelect: IonSelect;
  @ViewChild('destSelect', {static : false}) destSelect: IonSelect;

  private myObs: any;
  private rates: any[];
  private fromValue = 0;
  private resValue = 0;

  constructor(private httpClient: HttpClient) {
    this.updateRates();
  }

  fetchRates(from: string): Observable<any> {
    return this.httpClient.get<any>('https://api.exchangeratesapi.io/latest?base=' + from).pipe(map(res => res || []));
  }

  setSelectedValues() {
    this.baseSelect.value = this.baseCurrency;
    this.destSelect.value = this.toCurrency;
  }

  updateRates() {
    this.myObs = this.fetchRates(this.baseCurrency);
    this.myObs.subscribe(data => {
      this.rates = data.rates;
      if (this.baseCurrency === 'EUR') {
        this.rates['EUR'] = '1.0';
      }
      this.setSelectedValues();
      this.convertValue();
    });
  }

  ngOnInit() {

  }

  onBaseChangeValue($event) {
    this.fromValue = +$event.target.value;
    this.convertValue();
  }

  onBaseChangeCurrency($event) {
    this.baseCurrency = $event.target.value;
    this.updateRates();
  }

  onDestChangeCurrency($event) {
    this.toCurrency = $event.target.value;
    this.convertValue();
  }

  convertValue() {
    this.resValue = this.fromValue * this.rates[this.toCurrency];
    this.resValue = Math.round(this.resValue * 100) / 100;
  }

  invertCurrency() {
    const tmp = this.baseCurrency;
    this.baseCurrency = this.toCurrency;
    this.toCurrency = tmp;
    this.setSelectedValues();
    this.convertValue();
  }

}

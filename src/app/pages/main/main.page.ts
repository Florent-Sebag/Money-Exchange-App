import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
  constructor(private httpClient: HttpClient) { }

  fetchRates(from: string): Observable<any> {
      return this.httpClient.get<any>('https://api.exchangeratesapi.io/latest?base=' + from).pipe(map(res => res || []));
  }

  fetchSymbols(): Observable<any> {
      return this.httpClient.get<any>('http://data.fixer.io/api/symbols?access_key=318f00ec8dd0dc488c14121b6e26279d')
          .pipe(map(res => res || []));
  }

  updateRates() {
      this.myObs = this.fetchRates(this.baseCurrency);
      this.myObs.subscribe(data => {
          this.rates = data.rates;
          if (this.baseCurrency === 'EUR') {
              this.rates['EUR'] = '1.0';
          }
      });
  }

  ngOnInit() {
      this.updateRates();
      this.myObs = this.fetchSymbols();
      this.myObs.subscribe(data => {
          this.syms = data.symbols;
      });
  }
  onBaseChange($event) {
      this.baseCurrency = $event.target.value;
      this.updateRates();
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-item-currency',
  templateUrl: './item-currency.component.html',
  styleUrls: ['./item-currency.component.scss'],
})
export class ItemCurrencyComponent implements OnInit {
  @Input() srcCurrency: string;
  @Input() destCurrency: string;
  @Input() destSym: string;
  @Input() rate: string;
  destImg: string;

  constructor() {}

  ngOnInit() {
    this.destImg = this.destCurrency.substr(0, this.destCurrency.length - 1).toLowerCase();
  }

}

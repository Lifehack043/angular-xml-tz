import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Subscription } from 'rxjs';
import { IValute } from '../interfaces/interface';

@Component({
  selector: 'app-dayli-euro',
  templateUrl: './dayli-euro.component.html',
  styleUrls: ['./dayli-euro.component.sass']
})

export class DayliEuroComponent implements OnInit, OnDestroy {
  private cursValute: IValute;
  private currencyServiceObserver: Subscription;
  constructor(
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.currencyServiceObserver = this.currencyService.getCurrenciesTimer().subscribe(response => {
      const { EUR } = response;
      this.cursValute = EUR;
    });
  }

  ngOnDestroy(): void {
    this.currencyServiceObserver.unsubscribe();
  }
}

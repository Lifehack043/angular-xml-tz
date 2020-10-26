import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { RequestService } from '../services/requests.service';
import { Currency } from '../interfaces/currency.interface';


@Component({
  selector: 'app-dayli-euro',
  templateUrl: './dayli-euro.component.html',
  styleUrls: ['./dayli-euro.component.sass']
})
export class DayliEuroComponent implements OnInit {

  constructor(
    private DailyEuroService: CurrencyService,
    private RequestService: RequestService
  ) {}

  public reqs = this.RequestService.requests;
  public reqText : any;
  public cursCurrency : Currency;


  async ngOnInit() {
    await this.RequestService.getAllReqs();

    // this.DailyEuroService.getEuroValue();
    // setInterval(() => {
    //   this.DailyEuroService.getEuroValue();
    // }, 10000);
  }

  public add(req: string) {
    this.RequestService.addReq(req);
  }
}

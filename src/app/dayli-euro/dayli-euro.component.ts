import { Component, OnInit } from '@angular/core';
import { DailyEuroService } from '../services/daity-euro.service';
import { RequestService } from '../services/requests.service';
import { Valute } from '../interfaces/interface.valute';
import { parseString } from 'xml2js';


@Component({
  selector: 'app-dayli-euro',
  templateUrl: './dayli-euro.component.html',
  styleUrls: ['./dayli-euro.component.sass']
})
export class DayliEuroComponent implements OnInit {

  constructor(
    private DailyEuroService: DailyEuroService,
    private requestService: RequestService
  ) {}

  private defaultReq = [
    "https://www.cbr-xml-daily.ru/daily_utf8.xml",
    "https://www.cbr-xml-daily.ru/daily_json.js",
  ];

  public reqs = [];
  public reqText : any;
  public cursValute : Valute;


  async ngOnInit() {
    await this.getReqs();

    this.getEuroValue();
    setInterval(() => {
      this.getEuroValue();
    }, 10000);
  }

  public add(req: string) {
    if (!req) { return; }
    this.newPath(req);
  }

  private getReqs() {
    for (let i = 0; i < this.defaultReq.length; i++) {
      this.newPath(this.defaultReq[i]);
    }
  }

  public getEuroValue() {
    for (let i = 0; i < this.defaultReq.length; i++) {
      try {
        const _xhr = this.DailyEuroService.getValue(this.defaultReq[i])
          .subscribe(_res => {
            this.reqText = _res;
            this.setEuroValue(_res);
            _xhr.unsubscribe();
          });
        return;
      } catch {
        console.log(`No interner connection: ${this.defaultReq[i]}`);
      }
    }
  }

  private setEuroValue(res: any) {
    let _VAL = null,
        _ID = null;

    const KEY = "CharCode",
          VALUTE = "Value",
          VALUTE_NAME = "EUR",
          VALUTE_CODE = "NumCode",
          findEuroValue = (object, key, val) => {
            Object.keys(object).forEach(k => {
              if (typeof object[k] === "object") {
                if (object[k][KEY] === VALUTE_NAME) {
                  _ID = object[k][VALUTE_CODE];
                  _VAL = object[k][VALUTE];
                  return;
                }
                findEuroValue(object[k], key, val);
              }
            });
          }

    if (!this.isJson(res)) {
      parseString(res, {
        explicitArray: false,
        ignoreAttrs: true
      }, (error, result) => {
        if (error) {
          throw new Error(error);
        } else {
          res = result;
        }
      });
    } else {
      res = JSON.parse(res);
    }

    findEuroValue(res, _ID, _VAL);

    if (!_VAL && !_ID) {
      return;
    }

    if (typeof _VAL === "string") {
      _VAL = _VAL.replace(",", ".");
      _VAL = new Number(_VAL);
    }

    this.cursValute = <Valute> {
      Value: _VAL,
      Id: _ID,
    };
  }

  private isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  private newPath(req: string) {
    // only https
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if (!req.match(regex) || this.requestService.requests.includes(req)) { return; }
    this.reqs.push(req);
    this.requestService.add(`${req}`);
  }
}

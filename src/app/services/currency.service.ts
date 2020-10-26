import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Currency } from '../interfaces/currency.interface';
import { catchError, tap } from 'rxjs/operators';
import { parseString } from 'xml2js';


let requestOptions: Object = {
  responseType: 'text'
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {

  constructor(
    private http: HttpClient) { }

  getValue (uri): Observable<Currency>  {
    return this.http.get<Currency>(uri, requestOptions)
      .pipe(
        tap(_ => this.log('All good!')),
        catchError(this.handleError<any>('getEuroValue'))
      );
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
          Currency = "Value",
          Currency_NAME = "EUR",
          Currency_CODE = "NumCode",
          findEuroValue = (object, key, val) => {
            Object.keys(object).forEach(k => {
              if (typeof object[k] === "object") {
                if (object[k][KEY] === Currency_NAME) {
                  _ID = object[k][Currency_CODE];
                  _VAL = object[k][Currency];
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


    console.log(_ID, _VAL);
    this.cursCurrency = <Currency> {
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



  private handleError<T> (result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`DailyEuroService: ${message}`);
  }
}


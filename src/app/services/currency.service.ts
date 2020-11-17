import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { ICurrencyMap } from '../interfaces/interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { at, keyBy  } from 'lodash';
import { xml2js } from 'xml-js';

interface ICurrencyUris {
  [key: number]: ICurrencyUri;
}

interface ICurrencyUri {
  responseType: 'json' | 'xml';
  uri: string;
  uriOptions?: object;
  mapping?: {
    rootPath: string
    currency?: {
      ID?: string
      NumCode: string
      CharCode: string
      Nominal: string
      Name: string
      Value: string
      Previous?: string
    }
  };
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private sourceMapping: ICurrencyUris = {
    0: {
      responseType: 'json',
      uri: 'https://httpstat.us/500'
    },
    1: {
      responseType: 'json',
      uri: 'https://httpstat.us/400'
    },
    2: {
      responseType: 'json',
      uri: 'https://www.cbr-xml-daily.ru/daily_json.js',
      mapping: {
        rootPath: 'Valute'
      }
    },
    3: {
      responseType: 'xml',
      uri: 'https://www.cbr-xml-daily.ru/daily_utf8.xml',
      uriOptions: {
        responseType: 'text'
      },
      mapping: {
        rootPath: 'ValCurs.Valute',
        currency: {
          NumCode: 'NumCode._text',
          CharCode: 'CharCode._text',
          Nominal: 'Nominal._text',
          Name: 'Name._text',
          Value: 'Value._text',
        }
      }
    }
  };

  private currentSource = 0;

  constructor(private http: HttpClient) {}

  get sourceSettings(): ICurrencyUri {
    return this.sourceMapping[this.currentSource];
  }

  getCurrencies(): Observable < ICurrencyMap >  {
    return this.requestObserver()
      .pipe(
        map(this.buildCurrencies.bind(this))
      );
  }

  getCurrenciesTimer(interval = 10000): Observable < ICurrencyMap > {
    return timer(0, interval).pipe(
      switchMap(this.getCurrencies.bind(this))
    );
  }

  private requestObserver(): Observable <any> {
    const { uri, uriOptions } = this.sourceSettings;
    return this.http.get(uri, uriOptions).pipe(
      catchError(this.handleError.bind(this)),
    );
  }

  private handleError(err, caught): Observable < any > {
    this.changeSource();
    return this.requestObserver.call(this);
  }

  private changeSource(): void {
    const count = Object.keys(this.sourceMapping).length;
    switch (true) {
      case count > this.currentSource:
        this.currentSource ++;
        break;
      case count < this.currentSource:
        throw new Error('Закончились урлы');
        break;
    }
  }

  private buildCurrencies(response): ICurrencyMap {
    switch (this.sourceSettings.responseType) {
      case 'xml':
        return this.normalizeXml.call(this, response);
      case 'json':
        return this.normalizeJson.call(this, response);
      default:
        break;
    }
  }

  private normalizeXml(response): ICurrencyMap {
    const jsXml = xml2js(response, {compact: true, ignoreAttributes: true});
    const currencies = at(jsXml, this.sourceSettings.mapping.rootPath)[0];
    const normalizedMap = keyBy(currencies, this.sourceSettings.mapping.currency.CharCode);
    return this.mappingCurrencies(normalizedMap);
  }

  private normalizeJson(response): ICurrencyMap {
    return at(response, this.sourceSettings.mapping.rootPath)[0];
  }

  private mappingCurrencies(response): ICurrencyMap {
    const currencyMap = Object.keys(response).reduce((memo, currencyKey) => {
      memo[currencyKey] = Object.keys(this.sourceSettings.mapping.currency).reduce((valueMemo, valueCurrency) => {
        const path = this.sourceSettings.mapping.currency[valueCurrency];
        valueMemo[valueCurrency] = at(response[currencyKey], path)[0];
        return valueMemo;
      }, {});
      return memo;
    }, {});
    return currencyMap as ICurrencyMap;
  }
}


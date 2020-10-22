import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Valute } from '../interfaces/interface.valute';
import { catchError, tap } from 'rxjs/operators';


let requestOptions: Object = {
  responseType: 'text'
}

@Injectable({ providedIn: 'root' })
export class DailyEuroService {

  constructor(
    private http: HttpClient) { }

  getValue (uri): Observable<Valute>  {
    return this.http.get<Valute>(uri, requestOptions)
      .pipe(
        tap(_ => this.log('All good!')),
        catchError(this.handleError<any>('getEuroValue'))
      );
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


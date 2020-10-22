import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RequestService {
  requests: string[] = [];

  add(req: string) {
    this.requests.push(req);
  }

  clear() {
    this.requests = [];
  }
}
